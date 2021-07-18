import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Md5 } from 'ts-md5';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { ApprovedList } from './entity/approved-list.entity';
import { Auth } from './entity/auth.entity';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
    @InjectRepository(ApprovedList)
    private approvedRepository: Repository<ApprovedList>,
    private usersService: UsersService,
    private emailService: EmailService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const mainUrl = `http://localhost:${
      parseInt(process.env.PORT, 10) || 3000
    }`;
    console.log(mainUrl);
    // check existing login
    const exist = await this.usersService.getByLogin(signUpDto.login);
    if (exist)
      return { status: 'error', message: 'User with this login was existed' };

    // encrypt password

    // create user
    const user = await this.usersService.create(signUpDto);

    // create code for approved
    const code = Md5.hashStr(user.id);

    // add user in non-approved entity
    await this.approvedRepository.save({ userId: user.id, code });

    // form link with code
    const link = `${mainUrl}/auth/approved?code=${code}`;

    // send approved message with link with code
    await this.emailService.sendApproveEmail(user.login, link);

    return link;
  }

  async approvedFromEmail(code: string) {
    return code;
    // checked link
    // create token
    // remove user from non-approved entity
  }

  async signIn(signInDto: SignInDto) {
    console.log('Hello');
    return 'Hello!';
    // check login
    // check password
    // created token
  }

  async me() {
    // check token
  }
}
