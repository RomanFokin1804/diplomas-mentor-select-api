import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Md5 } from 'ts-md5';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { ApprovedList } from './entity/approved-list.entity';
import { Auth } from './entity/auth.entity';
import { EmailService } from 'src/email/email.service';
import { CryptService } from 'src/crypt/crypt.service';
import { ApprovedCodeDto } from './dto/approved-code.dto';
import { jwtConstants } from 'config/jwt.config';
import { cryptConstants } from 'config/crypt.config';

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
    const payload = { login: exist.login, sub: exist.id };

    const access_token = this.jwtService.sign(payload, {
      secret: jwtConstants.secretAccess,
      expiresIn: jwtConstants.expiresInAccess,
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: jwtConstants.secretRefresh,
      expiresIn: jwtConstants.expiresInRefresh,
    });

    return { status: 'success', result: { access_token, refresh_token } };
  }

  async me(req) {
    // check token
    return req.user;
  }
}
