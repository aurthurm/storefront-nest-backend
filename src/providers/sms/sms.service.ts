import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class SmsService {
  constructor(private readonly httpService: HttpService) {}

  sendSMS(to: any, body: string): Observable<any> {
    const data = {
      messages: [
        {
          body,
          to,
          from: 'storefront',
        },
      ],
    };
    return this.httpService.post(process.env.SMS_GATEWAY, data, {
      auth: {
        username: process.env.SMS_GATEWAY_USERNAME,
        password: process.env.SMS_GATEWAY_PASSWORD,
      },
    });
  }
}
