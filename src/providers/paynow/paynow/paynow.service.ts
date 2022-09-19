import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Paynow } from 'paynow';
import { Observable } from 'rxjs';

@Injectable()
export class PaynowService {
  paynow = new Paynow(
    process.env.PAYNOW_INTEGRATION_ID,
    process.env.PAYNOW_INTEGRATION_KEY,
  );

  constructor(private readonly httpService: HttpService) {
    this.paynow.resultUrl = 'http://example.com/gateways/paynow/update';
    this.paynow.returnUrl = 'https://wa.me/263713069794';
  }

  createPayment() {
    const payment = this.paynow.createPayment(
      'Invoice 35',
      'tendaikatsande@live.com',
    );
    payment.add('Subscription', 2.5);
    return payment;
  }

  async sendToWeb(payment: any) {
    return await this.paynow.send(payment);
  }

  async sendToMobile(payment) {
    this.paynow
      .sendMobile(
        // The payment to send to Paynow
        payment,

        // The phone number making payment
        '0775313603',

        // The mobile money method to use.
        'ecocash',
      )
      .then(function (response) {
        if (response.success) {
          // These are the instructions to show the user.
          // Instruction for how the user can make payment
          const instructions = response.instructions; // Get Payment instructions for the selected mobile money method

          // Get poll url for the transaction. This is the url used to check the status of the transaction.
          // You might want to save this, we recommend you do it
          const pollUrl = response.pollUrl;

          console.log(instructions);
        } else {
          console.log(response.error);
        }
      })
      .catch((ex) => {
        // Ahhhhhhhhhhhhhhh
        // *freak out*
        console.log('Your application has broken an axle', ex);
      });
  }

  decodeUrlParams = (params) => Object.fromEntries(new URLSearchParams(params));

  pollUrl(url: string): Observable<any> {
    return this.httpService.get(url);
  }
}
