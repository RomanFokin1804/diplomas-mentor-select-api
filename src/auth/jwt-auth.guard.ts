import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from './entity/auth.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
  ) {
    super();
  }
  async canActivate(context): Promise<boolean> {
    if (context?.args[0]?.headers?.authorization?.slice(0, 6) !== 'Bearer') {
      throw new UnauthorizedException('Not bearer token');
    }

    const accessToken = context?.args[0]?.headers?.authorization?.slice(7);
    const existToken = await this.authRepository.findOne({ accessToken });
    if (!existToken) {
      throw new UnauthorizedException('Incorrect token');
    }

    const parentCanActivate = (await super.canActivate(context)) as boolean;
    return parentCanActivate;
  }

  /* handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  } */
}
