import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EnTranslations } from 'src/helpers/constants';
import BotMenuBuilder from 'src/helpers/menu.builder';
import { Bot } from './entities/bot.entity';
import { BotAccountService } from 'src/providers/bot-account/bot-account.service';
import { OTPGenerator } from 'src/helpers/otp.generator';
import { SmsService } from 'src/providers/sms/sms.service';
import { ListingService } from '../listing/listing.service';
import { TenantService } from '../tenant/tenant.service';
import { CreateTenantDto } from '../tenant/dto/create-tenant.dto';
import { LeaseService } from '../lease/lease.service';
import { CreateLeaseDto } from '../lease/dto/create-lease.dto';

@Injectable()
export class BotService {
  source = '';
  isUserRegistered = false;
  menu: BotMenuBuilder = null;

  constructor(
    @InjectModel(Bot.name) private readonly botModel: Model<Bot>,
    private botAccountService: BotAccountService,
    private smsService: SmsService,
    private listingService: ListingService,
    private tenantService: TenantService,
    private leaseService: LeaseService,
  ) {}
  //

  async getWhatsAppResponse(source: string, message: string) {
    //
    this.source = source;
    return await this.botManager(source, message);
  }

  async botManager(source: string, message: string) {
    //check if its the init message
    const responses = {};
    const botSession = await this.getCurrentSession(source);
    if (botSession === null) {
      // Is user registered?
      const account = await this.botAccountService.checkIfAccountExists(source);
      let nextMenu = '3'; // Registration
      if (account) {
        nextMenu = '1.1'; // lOGIN

        if (!account.botActive) {
          nextMenu = '4'; // Termination
          if (account.status === 'confirm') {
            responses['get_phone'] = account.waBotPhone;
            nextMenu = '3'; // new account registration and activation
            // this.menuResolver('3.2.0').exec('');
          }
        }
      }

      this.menu = await this.menuResolver('1');

      const bot = new Bot();
      bot.source = source;
      bot.status = 'pending';
      bot.currentMenu = this.menu.Current;
      bot.nextMenu = nextMenu;
      bot.previousMenu = this.menu.Previous;
      bot.responses = { greetings: message, ...responses };
      bot.menuLock = true;
      await this.create(bot);
      this.menu.Current = nextMenu;
      return this.menu.build();
    }

    this.menu = await this.menuResolver(botSession.currentMenu);
    const isValidResponse = this.validateMenuResponse(message);

    if (isValidResponse) {
      let nextMenu = this.menu.Next ?? botSession.nextMenu;

      if (nextMenu === null) {
        nextMenu = botSession.currentMenu + `.${message}.1`;
        console.log(nextMenu);
      }

      // fire relative action
      const response = await this.menu.exec(message);

      if (response.success) {
        // Update session to progress to the next menu
        await this.moveBotCursor(botSession.currentMenu, nextMenu, null);
        //return next menu
        if (+nextMenu === 4 || response.notify) {
          //Check if response has notify and next menu should be notify
          response.notify && (nextMenu = '5');
          return (
            await (await this.menuResolver(nextMenu)).exec(response.message)
          ).message;
        }
        return (await this.menuResolver(nextMenu)).build();
      }

      return (await this.menuResolver(botSession.currentMenu))
        .setIsValidResponse(false)
        .setValidationResponse(response?.message)
        .build();
      //
    } else {
      // If response message is Invalid
      return (await this.menuResolver(this.menu.Current))
        .setIsValidResponse(false)
        .build();
    }
  }

  async menuResolver(stage: string) {
    switch (stage) {
      // LISTING_INIT_MESSAGE
      case '1': {
        const {
          title,
          options,
          validation,
          validationResponse,
          expectedResponses,
        } = EnTranslations.LISTING_INIT_MESSAGE;

        return new BotMenuBuilder(
          title,
          options,
          null,
          '1',
          null,
          validation,
          validationResponse,
          expectedResponses,
        )
          .get()
          .setAction(() => {
            return {
              notify: false,
              success: true,
              message: '',
            };
          });
      }

      // LOGIN
      case '1.1': {
        const {
          title,
          options,
          validation,
          validationResponse,
          expectedResponses,
        } = EnTranslations.LOGIN;

        return new BotMenuBuilder(
          title,
          options,
          '1',
          '1.1',
          '2',
          validation,
          validationResponse,
          expectedResponses,
        )
          .get()
          .setOptions([])
          .setAction(async (pin: string) => {
            const success = await this.botAccountService.pinLogin(
              this.source,
              pin,
            );

            return {
              notify: false,
              success,
              message: success ? '' : 'Invalid Pin: Try again',
            };
          });
      }

      // MAIN_MENU
      case '2': {
        const {
          title,
          options,
          validation,
          validationResponse,
          expectedResponses,
        } = EnTranslations.MAIN_MENU;
        return new BotMenuBuilder(
          title,
          options,
          '1',
          '2',
          null,
          validation,
          validationResponse,
          expectedResponses,
        )
          .get()
          .setAction((message: string) => {
            return {
              notify: false,
              success: true,
              message: '',
            };
          });
      }

      // VIEW LISTINGS
      case '2.1.1': {
        const {
          title,
          options,
          validation,
          validationResponse,
          expectedResponses,
        } = EnTranslations.VIEW_LISTINGS;

        const toReadableDate = (d) => new Date(d).toLocaleDateString();
        const options2 = (await this.getListings()).map((listing, i) => {
          return `${listing.listingReference}. ${listing.listingReference} ${
            listing.address
          } valid until ${toReadableDate(listing.expirationDate)}`;
        });

        return new BotMenuBuilder(
          title,
          options2,
          '2',
          '2.1',
          '2',
          validation,
          validationResponse,
          expectedResponses,
        )
          .get()
          .setAction((message: string) => {
            return {
              notify: false,
              success: true,
              message: '',
            };
          });
      }

      // DELETE LISTINGS
      case '2.2.1': {
        const {
          title,
          options,
          validation,
          validationResponse,
          expectedResponses,
        } = EnTranslations.DELETE_LISTING;

        return new BotMenuBuilder(
          title,
          options,
          '2',
          '2.2.1',
          '2.2.2',
          validation,
          validationResponse,
          expectedResponses,
        )
          .get()
          .setAction(async (listingReference: string) => {
            await this.updateBotSession({
              'responses.listingReference': listingReference,
            });
            return {
              notify: false,
              success: true,
              message: '',
            };
          });
      }

      //CONFIRM DELETE LISTINGS
      case '2.2.2': {
        const {
          title,
          options,
          validation,
          validationResponse,
          expectedResponses,
        } = EnTranslations.CONFIRM_DELETE_LISTING;

        return new BotMenuBuilder(
          title,
          options,
          '2',
          '2.2.2',
          '2',
          validation,
          validationResponse,
          expectedResponses,
        )
          .get()
          .setAction(async (confirm: string) => {
            let success = false;
            let message = '';
            if (confirm.toLocaleLowerCase() === 'y') {
              const user = await this.botAccountService.getAccount(this.source);
              const { responses } = (await this.getCurrentSession(
                this.source,
              )) as any;
              const deleted = await this.listingService.findOneAndDelete({
                listingReference: responses['listingReference'],
                advertiserId: user._id,
              });
              if (deleted === null) {
                await this.moveBotCursor('2.2.1', '2', null);
                message = `Listing with id  ${responses['listingReference']} not found`;
              } else {
                success = true;
                message = `Listing with id  ${responses['listingReference']} was successfully deleted`;
              }
            } else {
              success = true;
              await this.moveBotCursor('2.2.1', '2', null);
            }

            return {
              notify: false,
              success,
              message,
            };
          });
      }

      // CHANGE_REMINDER_FREQUENCY
      case '2.3.1': {
        const {
          title,
          options,
          validation,
          validationResponse,
          expectedResponses,
        } = EnTranslations.CHANGE_REMINDER_FREQUENCY;

        return new BotMenuBuilder(
          title,
          options,
          '2',
          '2.3.1',
          '2',
          validation,
          validationResponse,
          expectedResponses,
        )
          .get()
          .setAction((selected: string) => {
            return {
              notify: false,
              success: true,
              message: 'You selected ' + selected,
            };
          });
      }

      // TENANT_SERVICES
      case '2.4.1': {
        const {
          title,
          options,
          validation,
          validationResponse,
          expectedResponses,
        } = EnTranslations.TENANT_SERVICES;

        return new BotMenuBuilder(
          title,
          options,
          '2',
          '2.4.1',
          null,
          validation,
          validationResponse,
          expectedResponses,
        )
          .get()
          .setAction((selected: string) => {
            return {
              notify: false,
              success: true,
              message: '',
            };
          });
      }

      // GET_TENANT_FIRST_NAME
      case '2.4.1.1.1': {
        const {
          title,
          options,
          validation,
          validationResponse,
          expectedResponses,
        } = EnTranslations.GET_TENANT_FIRST_NAME;

        return new BotMenuBuilder(
          title,
          options,
          '2.4.1',
          '2.4.1.1.1',
          '2.4.1.1.2',
          validation,
          validationResponse,
          expectedResponses,
        )
          .get()
          .setAction((firstName: string) => {
            this.updateBotSession({
              'responses.get_tenant_first_name': firstName,
            });
            return {
              notify: false,
              success: true,
              message: '',
            };
          });
      }

      // GET_TENANT_LAST_NAME
      case '2.4.1.1.2': {
        const {
          title,
          options,
          validation,
          validationResponse,
          expectedResponses,
        } = EnTranslations.GET_TENANT_LAST_NAME;

        return new BotMenuBuilder(
          title,
          options,
          '2.4.1.1.1',
          '2.4.1.1.2',
          '2.4.1.1.3',
          validation,
          validationResponse,
          expectedResponses,
        )
          .get()
          .setAction((lastName: string) => {
            this.updateBotSession({
              'responses.get_tenant_last_name': lastName,
            });
            return {
              notify: false,
              success: true,
              message: '',
            };
          });
      }

      // GET_TENANT_GENDER
      case '2.4.1.1.3': {
        const {
          title,
          options,
          validation,
          validationResponse,
          expectedResponses,
        } = EnTranslations.GET_TENANT_GENDER;

        return new BotMenuBuilder(
          title,
          options,
          '2.4.1.1.2',
          '2.4.1.1.3',
          '2.4.1.1.4',
          validation,
          validationResponse,
          expectedResponses,
        )
          .get()
          .setAction((gender: string) => {
            this.updateBotSession({
              'responses.get_tenant_gender': gender,
            });
            return {
              notify: false,
              success: true,
              message: '',
            };
          });
      }

      // GET_TENANT_PHONE
      case '2.4.1.1.4': {
        const {
          title,
          options,
          validation,
          validationResponse,
          expectedResponses,
        } = EnTranslations.GET_TENANT_PHONE;

        return new BotMenuBuilder(
          title,
          options,
          '2.4.1.1.3',
          '2.4.1.1.4',
          '2.4.1.1.5',
          validation,
          validationResponse,
          expectedResponses,
        )
          .get()
          .setAction((phone: string) => {
            this.updateBotSession({
              'responses.get_tenant_phone': phone,
            });
            return {
              notify: false,
              success: true,
              message: '',
            };
          });
      }

      // GET_TENANT_IDENTIFICATION
      case '2.4.1.1.5': {
        const {
          title,
          options,
          validation,
          validationResponse,
          expectedResponses,
        } = EnTranslations.GET_TENANT_IDENTIFICATION;

        return new BotMenuBuilder(
          title,
          options,
          '2.4.1.1.4',
          '2.4.1.1.5',
          '2.4.1.1.6',
          validation,
          validationResponse,
          expectedResponses,
        )
          .get()
          .setAction((identification: string) => {
            this.updateBotSession({
              'responses.get_tenant_identification': identification,
            });
            return {
              notify: false,
              success: true,
              message: '',
            };
          });
      }

      // GET_AVAILABLE_LISTINGS
      case '2.4.1.1.6': {
        const {
          title,
          options,
          validation,
          validationResponse,
          expectedResponses,
        } = EnTranslations.GET_AVAILABLE_LISTINGS;

        const toReadableDate = (d) => new Date(d).toLocaleDateString();
        const listings = await this.getListings({
          status: 'available',
        });

        const listingRefs = listings.map((listing) => listing.listingReference);
        const options2 = listings.map((listing) => {
          return `${listing.listingReference}. ${listing.listingReference} ${
            listing.address
          } valid until ${toReadableDate(listing.expirationDate)}`;
        });

        return new BotMenuBuilder(
          title,
          options2,
          '2.4.1.1.5',
          '2.4.1.1.6',
          '2.4.1.1.7',
          validation,
          'Please select a valid Listing reference',
          listingRefs,
        )
          .get()
          .setAction((listing: string) => {
            this.updateBotSession({
              'responses.get_tenant_listing': listing,
            });
            return {
              notify: false,
              success: true,
              message: '',
            };
          });
      }

      // GET_TENANT_LEASE_START_DATE
      case '2.4.1.1.7': {
        const {
          title,
          options,
          validation,
          validationResponse,
          expectedResponses,
        } = EnTranslations.GET_TENANT_LEASE_START_DATE;

        return new BotMenuBuilder(
          title,
          options,
          '2.4.1.1.6',
          '2.4.1.1.7',
          '2.4.1.1.8',
          validation,
          validationResponse,
          expectedResponses,
        )
          .get()
          .setAction((startDate: string) => {
            this.updateBotSession({
              'responses.get_lease_start_date': startDate,
            });
            return {
              notify: false,
              success: true,
              message: '',
            };
          });
      }

      // GET_TENANT_LEASE_END_DATE
      case '2.4.1.1.8': {
        const {
          title,
          options,
          validation,
          validationResponse,
          expectedResponses,
        } = EnTranslations.GET_TENANT_LEASE_END_DATE;

        return new BotMenuBuilder(
          title,
          options,
          '2.4.1.1.7',
          '2.4.1.1.8',
          '2.4.1.1.9',
          validation,
          validationResponse,
          expectedResponses,
        )
          .get()
          .setAction((endDate: string) => {
            this.updateBotSession({
              'responses.get_lease_end_date': endDate,
            });
            return {
              notify: false,
              success: true,
              message: '',
            };
          });
      }

      // GET_TENANT_CONFIRM_LEASE
      case '2.4.1.1.9': {
        const {
          title,
          options,
          validation,
          validationResponse,
          expectedResponses,
        } = EnTranslations.GET_TENANT_CONFIRM_LEASE;

        return new BotMenuBuilder(
          title,
          options,
          '2.4.1.1.8',
          '2.4.1.1.9',
          '4',
          validation,
          validationResponse,
          expectedResponses,
        )
          .get()
          .setAction(async (confirm: string) => {
            this.updateBotSession({
              'responses.get_confirm_lease': confirm,
            });
            //
            const user = await this.botAccountService.getAccount(this.source);
            const { responses } = (await this.getCurrentSession(
              this.source,
            )) as any;
            //
            let message;
            if (confirm.toLocaleLowerCase() === 'y') {
              // Create Tenant
              const tenantDto = new CreateTenantDto();
              tenantDto.firstName = responses['get_tenant_first_name'];
              tenantDto.lastName = responses['get_tenant_last_name'];
              tenantDto.gender = responses['get_tenant_gender']; // ?
              tenantDto.phoneNumber = responses['get_tenant_phone'];
              tenantDto.idNumber = responses['get_tenant_identification'];
              const tenant = await this.tenantService.create(tenantDto);

              // get selected listing
              let listing: any = await this.listingService.findAll({
                listingReference: responses['get_tenant_listing'],
                advertiserId: user._id,
              });
              if (listing.length) {
                listing = listing[0];
              }
              // OTP gen
              const code = new OTPGenerator().generateOTP(6);
              // Create Lease
              const leaseDTO = new CreateLeaseDto();
              leaseDTO.userId = user._id;
              leaseDTO.tenantId = tenant._id.toString();
              leaseDTO.listingId = listing._id;
              leaseDTO.startDate = responses['get_lease_start_date'];
              leaseDTO.endDate = responses['get_lease_end_date'];
              leaseDTO.comment = '';
              leaseDTO.code = +code;
              leaseDTO.status = 'pending';
              leaseDTO.codeExpiry = new Date(+new Date() + 86400000);
              const lease = await this.leaseService.create(leaseDTO);
              // update listing
              listing.status = 'pending';
              listing.leaseId = lease._id.toString();
              await this.listingService.update(listing._id, listing);

              // send sms

              this.smsService.sendSMS(
                [tenantDto.phoneNumber],
                `Dear Tenant ID ${tenantDto.idNumber} please send Confirmation Code ${code} to your new Landlord to
                complete your Lease Registration Process. Please note the code is valid for 24 hours.`,
              );

              message = `Thank you for confirming Tenant ${tenantDto.idNumber} an SMS has been sent to the Tenant for
              confirmation please Text 'Hi' to access Main Menu and select 'Confirm Tenant' Menu to enter
              Tenant Confirm Code to complete the process your Tenant Subscription Services are valid until
              03.04.22 / inactive (if inactive please send a message “Hi” and select Subscribe from the Main Menu`;
            } else {
              message = `Your current session has been cancelled to access the Main Menu please send “Hi” and select
              preferred service thank you for using StoreFront Services your Tenant Services subscription are valid
              until 03.04.22” / inactive (if inactive please send a message “Hi” and select Subscribe from the Main
              Menu`;
            }

            return {
              notify: false,
              success: true,
              message,
            };
          });
      }

      case '2.4.1.2.1': {
        const {
          title,
          options,
          validation,
          validationResponse,
          expectedResponses,
        } = EnTranslations.GET_TENANT_CONFIRMATION_CODE;

        return new BotMenuBuilder(
          title,
          options,
          '2.4.1',
          '2.4.1.2.1',
          '2.4.1',
          validation,
          validationResponse,
          expectedResponses,
        )
          .get()
          .setAction(async (code: string) => {
            this.updateBotSession({
              'responses.get_lease_confirmation': code,
            });
            let message,
              success = false;
            const user = await this.botAccountService.getAccount(this.source);
            let lease: any = await this.leaseService.findAll({
              userId: user._id,
              code,
              status: 'pending',
            });
            if (lease.length) {
              lease = lease[0];
              // check if not expired
              if (+new Date(lease.codeExpiry) > +new Date()) {
                // lease confirmation code is valid
                lease.status = 'confirmed';
                success = true;
                message = 'Confirmed ';
              } else {
                lease.status = 'expired';
                message = 'The Lease verification code has expired';
                // TODO: Discuss what to do when lease code has expired
              }
              await this.leaseService.update(lease._id, lease);
            } else {
              // No lease found
              message = `Lease with verification code ${code} not found`;
            }

            console.log(lease);

            return {
              notify: true,
              success,
              message,
            };
          });
      }

      // TERMINATE_LEASE
      case '2.5.1': {
        const {
          title,
          options,
          validation,
          validationResponse,
          expectedResponses,
        } = EnTranslations.TERMINATE_LEASE;

        return new BotMenuBuilder(
          title,
          options,
          '2',
          '2.5.1',
          '2',
          validation,
          validationResponse,
          expectedResponses,
        )
          .get()
          .setAction((selected: string) => {
            return {
              notify: false,
              success: true,
              message: '',
            };
          });
      }

      // REGISTRATION_MENU
      case '3': {
        const {
          title,
          options,
          validation,
          validationResponse,
          expectedResponses,
        } = EnTranslations.REGISTRATION_MENU;
        return new BotMenuBuilder(
          title,
          options,
          '1',
          '3',
          null,
          validation,
          validationResponse,
          expectedResponses,
        )
          .get()
          .setAction(async (message: string) => {
            const otp = new OTPGenerator().generateOTP(4);
            await this.updateBotSession({
              'responses.otp': otp,
            });
            console.log('otp generated: sending sms: ', otp);
            this.smsService.sendSMS(
              [this.source],
              `Your one time account confirmation password is ${otp}`,
            );

            return {
              notify: false,
              success: true,
              message: '',
            };
          });
      }

      // ACTIVATE_ACCOUNT
      case '3.1.1': {
        const {
          title,
          options,
          validation,
          validationResponse,
          expectedResponses,
        } = EnTranslations.CONFIRM_PHONE_MENU;
        return new BotMenuBuilder(
          title,
          options,
          '1',
          '3.1.1',
          '3.2.2',
          validation,
          validationResponse,
          expectedResponses,
        )
          .get()
          .setAction(async (pin: string) => {
            this.updateBotSession({ 'responses.otp_confirmation': +pin });
            const success = await this.confirmExistingPhonePin(+pin);
            return {
              notify: false,
              success,
              message: success ? '' : 'Invalid OTP',
            };
          });
      }

      // Confirm whatsapp number used to access bot
      case '3.2.1': {
        const {
          title,
          options,
          validation,
          validationResponse,
          expectedResponses,
        } = EnTranslations.CONFIRM_PHONE_MENU;
        return new BotMenuBuilder(
          title,
          options,
          '3',
          '3.2.1',
          '3.2.2',
          validation,
          validationResponse,
          expectedResponses,
        )
          .get()
          .setAction(async (pin: string) => {
            this.updateBotSession({ 'responses.otp_confirmation': +pin });
            const success = await this.confirmExistingPhonePin(+pin);
            return {
              notify: false,
              success,
              message: success ? '' : 'Invalid OTP',
            };
          });
      }

      // GET_PIN_MENU
      case '3.2.2': {
        const {
          title,
          options,
          validation,
          validationResponse,
          expectedResponses,
        } = EnTranslations.GET_PIN_MENU;
        return new BotMenuBuilder(
          title,
          options,
          '3.2.1',
          '3.2.2',
          '3.2.3',
          validation,
          validationResponse,
          expectedResponses,
        )
          .get()
          .setAction((pin: string) => {
            this.updateBotSession({ 'responses.get_pin': pin });
            return {
              notify: false,
              success: true,
              message: '',
            };
          });
      }

      // CONFIRM_PIN_MENU
      case '3.2.3': {
        const {
          title,
          options,
          validation,
          validationResponse,
          expectedResponses,
        } = EnTranslations.CONFIRM_PIN_MENU;
        return new BotMenuBuilder(
          title,
          options,
          '3.2.2',
          '3.2.3',
          '4',
          validation,
          validationResponse,
          expectedResponses,
        )
          .get()
          .setAction(async (pin: number) => {
            this.updateBotSession({ 'responses.confirmed_pin': +pin });
            const success = await this.confirmPin(+pin);

            if (success) {
              await this.botAccountService.createOrUpdateAccount(
                this.source,
                pin.toString(),
                true,
              );
            }

            const successMessage = `Thank you for activating account ${this.source} please text Hi and Login with 4 digit pin for assistance please contact our support from the main menu`;
            return {
              notify: false,
              success,
              message: success ? successMessage : 'Pins do not match',
            };
          });
      }

      // CHANGE_ACCOUNT
      case '3.3.1': {
        const {
          title,
          options,
          validation,
          validationResponse,
          expectedResponses,
        } = EnTranslations.CHANGE_ACCOUNT_NUMBER;
        return new BotMenuBuilder(
          title,
          options,
          '3',
          '3.3.1',
          '4',
          validation,
          validationResponse,
          expectedResponses,
        )
          .get()
          .setAction(async (message: string) => {
            return {
              notify: false,
              success: true,
              message: ' ',
            };
          });
      }

      // SUPPORT
      case '3.4.1': {
        const {
          title,
          options,
          validation,
          validationResponse,
          expectedResponses,
        } = EnTranslations.SUPPORT;
        return new BotMenuBuilder(
          title,
          options,
          '3',
          '3.4.1',
          '4',
          validation,
          validationResponse,
          expectedResponses,
        )
          .get()
          .setAction(async (message: string) => {
            return {
              notify: false,
              success: true,
              message: ' ',
            };
          });
      }

      case '4': {
        const {
          title,
          options,
          validation,
          validationResponse,
          expectedResponses,
        } = EnTranslations.TERMINATE_BOT;
        return new BotMenuBuilder(
          title,
          options,
          null,
          null,
          null,
          validation,
          validationResponse,
          expectedResponses,
        )
          .get()
          .setAction(async (message: string) => {
            const { _id } = (await this.getCurrentSession(this.source)) as any;
            await this.updateSession(_id, {
              status: 'closed',
              menuLock: false,
            });
            return {
              notify: false,
              success: true,
              message: message,
            };
          });
      }

      case '5': {
        const {
          title,
          options,
          validation,
          validationResponse,
          expectedResponses,
        } = EnTranslations.NOTIFICATION;
        return new BotMenuBuilder(
          title,
          options,
          null,
          null,
          null,
          validation,
          validationResponse,
          expectedResponses,
        )
          .get()
          .setAction(async (message: string) => {
            return {
              notify: false,
              success: true,
              message: message,
            };
          });
      }

      default:
    }
  }

  validateMenuResponse(message: string) {
    const matched = this.menu.ExpectedResponses.filter((resp: any) => {
      return resp.toString().toLowerCase() === message.toLowerCase();
    });
    if (matched.length > 0) {
      return true;
    } else if (this.menu.ExpectedResponses.length > 0) {
      return false;
    }
    return this.menu.Validation.test(message);
  }

  create(bot: Bot) {
    return new this.botModel(bot).save();
  }

  getCurrentSession(source: string): Promise<Bot> {
    return this.botModel
      .findOne({ source: source, status: 'pending' })
      .lean()
      .exec();
  }
  updateSession(id: string, payload = {}) {
    return this.botModel.findByIdAndUpdate(id, payload);
  }

  async moveBotCursor(previousMenu, currentMenu, nextMenu) {
    const { _id } = (await this.getCurrentSession(this.source)) as any;
    return this.updateSession(_id, {
      previousMenu,
      currentMenu,
      nextMenu,
      menuLock: false,
    });
  }

  async updateBotSession(query: any) {
    const { _id } = (await this.getCurrentSession(this.source)) as any;
    return this.updateSession(_id, query);
  }

  async confirmNumber(source: string): Promise<boolean> {
    const { responses } = (await this.getCurrentSession(this.source)) as any;
    return responses['get_phone'] === source;
  }

  async confirmPin(pin: number): Promise<boolean> {
    const { responses } = (await this.getCurrentSession(this.source)) as any;
    return +responses['get_pin'] === +pin;
  }

  async confirmExistingPhonePin(pin: number): Promise<boolean> {
    const { responses } = (await this.getCurrentSession(this.source)) as any;
    return +responses['otp'] === +pin;
  }

  async getListings(query = {}) {
    const user = await this.botAccountService.getAccount(this.source);
    return await this.listingService.findAll({
      advertiserId: user._id,
      ...query,
    });
  }
}
