import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
const emailConfig = require('../../config/email.config.json');

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: emailConfig.host,
        port: emailConfig.port,
        secure: emailConfig.secure,
        auth: {
          user: emailConfig.user,
          pass: emailConfig.pass,
        },
      },
    }),
  ],
  exports: [EmailService],
  providers: [EmailService],
  controllers: [EmailController],
})
export class EmailModule {}
