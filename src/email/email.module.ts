import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { emailConstants } from 'config/email.config';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: emailConstants.host,
        port: emailConstants.port,
        secure: emailConstants.secure,
        auth: {
          user: emailConstants.user,
          pass: emailConstants.pass,
        },
      },
    }),
  ],
  exports: [EmailService],
  providers: [EmailService],
  controllers: [EmailController],
})
export class EmailModule {}
