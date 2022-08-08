import { Injectable } from '@nestjs/common';

@Injectable()
export class SmsService {
  send(recipients: any[], message: string) {
    // return true if successful
    console.log('sending: ', { recipients, message });
    return true;
  }
}
