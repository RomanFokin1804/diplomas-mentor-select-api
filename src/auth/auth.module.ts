import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entity/auth.entity';
import { UsersModule } from 'src/users/users.module';
import { ApprovedList } from './entity/approved-list.entity';
import { EmailModule } from 'src/email/email.module';
import { CryptModule } from 'src/crypt/crypt.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auth, ApprovedList]),
    UsersModule,
    EmailModule,
    CryptModule,
    JwtModule.register({}),
  ],
  exports: [TypeOrmModule],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
