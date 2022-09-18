import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class WhatsappService {
  constructor(private readonly httpService: HttpService) {}

  send(to: string, message: string): Observable<any> {
    return this.httpService.post(`${process.env.MULTIPLEXER}/whatsapp`, {
      to,
      message,
    });
  }
}
