import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Md5 } from 'ts-md5';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { ApprovedList } from './entity/approved-list.entity';
import { Auth } from './entity/auth.entity';
import { EmailService } from 'src/email/email.service';
import { CryptService } from 'src/crypt/crypt.service';
import { ApprovedCodeDto } from './dto/approved-code.dto';
import { jwtConstants } from 'config/jwt.config';
import { cryptConstants } from 'config/crypt.config';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
    @InjectRepository(ApprovedList)
    private approvedRepository: Repository<ApprovedList>,
    private usersService: UsersService,
    private emailService: EmailService,
    private cryptService: CryptService,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    try {
      // TODO add getMainUrl function
      const mainUrl = `http://localhost:${
        parseInt(process.env.PORT, 10) || 3000
      }`;

      // check existing login
      const exist = await this.usersService.getByLogin(signUpDto.login);
      if (exist)
        return { status: 'error', message: 'User with this login was existed' };

      // encrypt password
      signUpDto.password = await this.cryptService.encrypt(
        cryptConstants.password,
        cryptConstants.iv,
        signUpDto.password,
      );

      // create user
      const user = await this.usersService.create(signUpDto);

      // create code for approved
      const code = Md5.hashStr(user.id);

      // add user in non-approved entity
      await this.approvedRepository.save({ userId: user.id, code });

      // form link with code
      const link = `${mainUrl}/auth/approved?code=${code}`;
      console.log(link);

      // send approved message with link with code
      // await this.emailService.sendApproveEmail(user.login, link);

      return { status: 'success', result: user.id };
    } catch (e) {
      return { status: 'error', message: `Server error: ${e}` };
    }
  }

  async approvedFromEmail(approvedCodeDto: ApprovedCodeDto) {
    try {
      // checked link
      const exist = await this.approvedRepository.findOne({
        code: approvedCodeDto.code,
      });
      if (!exist) {
        return {
          status: 'error',
          message: 'User with this approved code not found!',
        };
      }

      // remove user from non-approved entity
      await this.approvedRepository.delete({ code: approvedCodeDto.code });
      return { status: 'success', result: { message: 'Success approve' } };
    } catch (e) {
      return { status: 'error', message: `Server error: ${e}` };
    }
  }

  async signIn(signInDto: SignInDto) {
    // check login
    const exist = await this.usersService.getByLogin(signInDto.login);
    if (!exist) {
      return { status: 'error', message: 'User with this login not existed' };
    }

    // check approved
    const existInApprovedList = await this.approvedRepository.findOne({
      userId: exist.id,
    });
    if (existInApprovedList) {
      return { status: 'error', message: 'User with this login not approved' };
    }

    // check password
    const decryptPassword = await this.cryptService.decrypt(
      cryptConstants.password,
      cryptConstants.iv,
      exist.password,
    );
    if (signInDto.password !== decryptPassword) {
      return { status: 'error', message: 'Password does not match' };
    }

    // create token
    const payload = { sub: exist.id };

    const accessToken = await this.createToken(
      payload,
      jwtConstants.secretAccess,
      jwtConstants.expiresInAccess,
    );

    const refreshToken = await this.createToken(
      payload,
      jwtConstants.secretRefresh,
      jwtConstants.expiresInRefresh,
    );

    // save tokens
    await this.authRepository.save({
      userId: exist.id,
      accessToken,
      refreshToken,
    });

    return { status: 'success', result: { accessToken, refreshToken } };
  }

  async me(req) {
    // check token
    return { status: 'success', result: req.user };
  }

  async replaceTokens(refreshTokenDto: RefreshTokenDto) {
    // without this transformations it`s not worked :(
    const decodedToken = JSON.parse(
      JSON.stringify(
        await this.jwtService.decode(refreshTokenDto.refreshToken),
      ),
    );

    const existToken = await this.authRepository.findOne({
      refreshToken: refreshTokenDto.refreshToken,
    });
    if (!existToken) {
      return { status: 'error', message: 'Incorrect token' };
    }

    const timeNow = Date.now();

    if (decodedToken.exp * 1000 < timeNow) {
      await this.authRepository.delete({
        refreshToken: refreshTokenDto.refreshToken,
      });
      return { status: 'error', message: 'Incorrect token' };
    }

    const user = await this.usersService.getById(decodedToken.sub);
    if (!user) {
      await this.authRepository.delete({
        refreshToken: refreshTokenDto.refreshToken,
      });
      return { status: 'error', message: 'Incorrect token' };
    }

    const payload = { sub: user.id };

    const accessToken = await this.createToken(
      payload,
      jwtConstants.secretAccess,
      jwtConstants.expiresInAccess,
    );

    const refreshToken = await this.createToken(
      payload,
      jwtConstants.secretRefresh,
      jwtConstants.expiresInRefresh,
    );

    await this.authRepository.update(existToken.id, {
      accessToken,
      refreshToken,
    });

    return { status: 'success', result: { accessToken, refreshToken } };
  }

  async createToken(payload, secret, expiresIn) {
    return this.jwtService.sign(payload, { secret, expiresIn });
  }
}
