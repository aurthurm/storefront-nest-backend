import { Injectable } from '@nestjs/common';

@Injectable()
export class SmsService {
  sendSms(recipients: any[], message: string) {
    // return true if successful
    return true;
  }
}
