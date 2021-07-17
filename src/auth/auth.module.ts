import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entity/auth.entity';
import { UsersModule } from 'src/users/users.module';
import { ApprovedList } from './entity/approved-list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Auth, ApprovedList]), UsersModule],
  exports: [TypeOrmModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
