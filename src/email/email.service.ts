import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { emailConstants } from 'config/email.config';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendApproveEmail(to: string, link: string) {
    try {
      const res = await this.mailerService.sendMail({
        from: `${emailConstants.from}`,
        to: to,
        // cc: cc,
        // bcc: bcc,
        subject: `Registration on service Diplomas Mentor Select`,
        text: `Hello!\nYou registration on service Diplomas Mentor Select.\nFor approve follow this link: ${link}.\nIf you have not registrated in our service - do not anything.`,
        html: '',
        attachments: [],
      });

      return res;
    } catch (e) {
      console.log(e);
      return { status: 'error', message: 'Send approved email error' };
    }
  }
}
