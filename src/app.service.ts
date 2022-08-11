import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private readonly mailerService: MailerService) {}

  public exampleMail(): void {
    this.mailerService
      .sendMail({
        to: 'tendaikatsande@live.com', // list of receivers
        from: 'noreply@nestjs.com', // sender address
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: 'welcome', // plaintext body
        html: '<b>welcome</b>', // HTML body content
      })
      .then((data) => console.log(data))
      .catch((data) => console.log(data));
  }

  getHello(): string {
    return 'Hello World!';
  }
}
