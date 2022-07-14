import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './resources/user/user.module';
import { AuthModule } from './resources/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './resources/auth/roles.guard';
import { EmailService } from './providers/email/email.service';
import { BotModule } from './resources/bot/bot.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1/storefront'),
    MailerModule.forRoot({
      transport: {
        host: 'localhost',
        port: 1025,
        ignoreTLS: true,
        secure: false,
        auth: {
          user: process.env.MAILDEV_INCOMING_USER,
          pass: process.env.MAILDEV_INCOMING_PASS,
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@localhost>',
      },
      preview: true,
      template: {
        dir: process.cwd() + '/template/',
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    }),
    AuthModule,
    UserModule,
    BotModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
