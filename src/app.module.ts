import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { CryptModule } from './crypt/crypt.module';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forRoot(),
    AuthModule,
    EmailModule,
    CryptModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// create cron for remove not-approved user
// create cron for remove old tokens (time of live in refreshToken)
