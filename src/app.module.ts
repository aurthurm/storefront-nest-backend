import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from './resources/user/user.module';
import { AuthModule } from './resources/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './resources/auth/roles.guard';
import { BotModule } from './resources/bot/bot.module';
import { ListingModule } from './resources/listing/listing.module';
import { TenantModule } from './resources/tenant/tenant.module';
import { LeaseModule } from './resources/lease/lease.module';
import { SubscriptionTypeModule } from './resources/subscription-type/subscription-type.module';
import { SubscriptionModule } from './resources/subscription/subscription.module';
import { ExchangeRateModule } from './resources/exchange-rate/exchange-rate.module';
import { AppInitService } from './providers/initialiser';
import { AccountModule } from './resources/account/account.module';
import { TransactionModule } from './resources/transaction/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(`mongodb://${process.env.DATABASE_URL}/storefront`),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        ignoreTLS: false,
        secure: true,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      defaults: {
        from: '"No Reply" auto@storefront',
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
    AccountModule,
    BotModule,
    ListingModule,
    TenantModule,
    LeaseModule,
    SubscriptionTypeModule,
    SubscriptionModule,
    ExchangeRateModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AppInitService,
  ],
})
export class AppModule {}
