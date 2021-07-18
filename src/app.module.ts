import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EmailController } from './email/email.controller';
import { EmailService } from './email/email.service';
import { EmailModule } from './email/email.module';

@Module({
  imports: [UsersModule, TypeOrmModule.forRoot(), AuthModule, EmailModule],
  controllers: [AppController, EmailController],
  providers: [AppService, EmailService],
})
export class AppModule {}

// create cron for remove not-approved user
