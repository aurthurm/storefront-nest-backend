import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';

@Injectable()
export class SmsService {
  constructor(private readonly httpService: HttpService) {}

  async sendSMS(to: string[], body: string) {
    const regex = new RegExp(/^(263|0)7[7-8|1|3][0-9]{7}$/);
    const zimMobiles = [];
    const intMobiles = [];

    let zimResponse = {};
    let intlResponse = {};

    to.forEach((number) => {
      if (regex.test(number)) {
        zimMobiles.push(number);
      } else {
        intMobiles.push(number);
      }
    });

    if (zimMobiles.length > 0)
      await this.sendViaEconet(zimMobiles, body).subscribe({
        next: (res) => {
          zimResponse = res;
        },
      });
    if (intMobiles.length > 0) {
      console.log('fired : ', intMobiles);
      await this.sendViaClickSend(intMobiles, body).subscribe({
        next: (res) => {
          intlResponse = res;
        },
      });
    }

    return { intlResponse, zimResponse };
  }

  sendViaEconet(mobiles: string[], sms: string): Observable<any> {
    return this.httpService.post(
      `${process.env.SMS_ECONET_GATEWAY}&mobiles=${mobiles.join(
        ',',
      )}&sms=${sms}&senderid=StoreFront`,
    );
  }

  sendViaClickSend(to: any, body: string): Observable<any> {
    const data = {
      messages: [
        {
          body,
          to,
          from: 'StoreFront',
        },
      ],
    };
    return this.httpService.post(process.env.SMS_CLICKSEND_GATEWAY, data, {
      auth: {
        username: process.env.SMS_CLICKSEND_GATEWAY_USERNAME,
        password: process.env.SMS_CLICKSEND_GATEWAY_PASSWORD,
      },
    });
  }
}
