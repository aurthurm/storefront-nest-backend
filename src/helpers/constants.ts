export const jwtConstants = {
  secret: 'secretKey',
};

export const UserRoles = ['SU_ADMIN', 'ADMIN', 'ADVERTISER'];

export enum Role {
  SU_ADMIN = 'SU_ADMIN',
  ADMIN = 'ADMIN',
  ADVERTISER = 'ADVERTISER',
}

export const EnTranslations = {
  LISTING_INIT_MESSAGE: {
    title: 'Thank you for Subscribing for StoreFront Services ',
    options: ['Please send the message “Hi” to activate the Main Menu'],
    validation: new RegExp(/^hi$/),
    validationResponse: 'Invalid Response',
    expectedResponses: ['Hi'],
    children: [],
  },

  REGISTRATION_MENU: {
    title: ' Welcome to StoreFront Services \nRegistration Menu',
    options: [
      '1. Activate Account (Listed from Advertiser (Use prefix e.g. +263 771 123456)',
      '2. New Account Registration & Activation',
      '3. Change Account Number',
      '4. Support',
    ],
    validation: new RegExp(/^[1-4]{1}$/),
    validationResponse: 'Please choose one of the following options: 1,2,3,4',
    expectedResponses: [1, 2, 3, 4],
    children: ['3.0', '3.1', '3.2', '3.3'],
  },

  GET_PHONE_MENU: {
    title: 'Enter Phone Number (With prefix e.g., +263 771 456789)',
    options: [],
    validation: new RegExp(/^(\+263|0)7[7-8|1|3][0-9]{7}$/),
    validationResponse:
      '“Account is already registered please use a different account to create account “ by saying Hi to access Registration Menu',
    expectedResponses: [],
    children: [],
  },

  CONFIRM_PHONE_MENU: {
    title: 'Confirm Account',
    options: [],
    validation: new RegExp(/^(\+263|0)7[7-8|1|3][0-9]{7}$/),
    validationResponse: '',
    expectedResponses: [],
    children: [],
  },

  GET_PIN_MENU: {
    title: 'Enter Preferred PIN',
    options: [],
    validation: new RegExp(/^[0-9]{4}$/),
    validationResponse:
      '“Account is already registered please use a different account to create account “ by saying Hi to access Registration Menu',
    expectedResponses: [],
    children: [],
  },

  CONFIRM_PIN_MENU: {
    title: 'Confirm Preferred PIN',
    options: [],
    validation: new RegExp(/^[0-9]{4}$/),
    validationResponse:
      'Thank you for activating account @phone_number please text “Hi” and Login with 4 Digit PIN for assistance please contact our Support from the Main Menu by texting the word “Support”',
    expectedResponses: [],
    children: [],
  },

  MAIN_MENU: {
    title: 'Main Menu',
    options: [
      '1. View My Listings',
      '2. Remove / Delete Listing/s',
      '3. Change Reminder Frequency',
      '4. Ternant Services\n\ta. Create Tenant\n\tb. Confirm Tenant\n\tc. Check My Tenant Status\n\td. Tenant Clearing Check\n\te. Blacklist / Un=blacklist Tenant.',
      '5. End / Terminate Lease Subscribe',
      '6. Support',
    ],
    validation: new RegExp(/^[1-6|a|b|c|c|d|e]{1}$/),
    validationResponse:
      'Please choose one of the following options: 1,2,3,4,a,b,c,d,e,5,6',
    expectedResponses: [1, 2, 3, 'a', 'b', 'c', 'd', 'e', 5, 6],
    children: [],
  },

  VIEW_LISTINGS: {
    title: ' ',
    options: [],
    validation: new RegExp(/^/),
    validationResponse: 'Please ',
    expectedResponses: [],
    children: [],
  },
  DELETE_LISTING: {
    title: ' ',
    options: [],
    validation: new RegExp(/^/),
    validationResponse: 'Please ',
    expectedResponses: [],
    children: [],
  },
  CHANGE_REMINDER_FREQUENCY: {
    title: ' ',
    options: [],
    validation: new RegExp(/^/),
    validationResponse: 'Please ',
    expectedResponses: [],
  },
  CREATE_TENANT: {
    title: ' ',
    options: [],
    validation: new RegExp(/^/),
    validationResponse: 'Please ',
    expectedResponses: [],
    children: [],
  },
  CONFIRM_TENANT: {
    title: ' ',
    options: [],
    validation: new RegExp(/^/),
    validationResponse: 'Please ',
    expectedResponses: [],
    children: [],
  },

  TENANT_STATUS: {
    title: ' ',
    options: [],
    validation: new RegExp(/^/),
    validationResponse: 'Please ',
    expectedResponses: [],
    children: [],
  },

  CLEAR_TENANT: {
    title: ' ',
    options: [],
    validation: new RegExp(/^/),
    validationResponse: 'Please ',
    expectedResponses: [],
    children: [],
  },

  BLACKLIST_TENANT: {
    title: ' ',
    options: [],
    validation: new RegExp(/^/),
    validationResponse: 'Please ',
    expectedResponses: [],
    children: [],
  },

  TERMINATE_LEASE: {
    title: ' ',
    options: [],
    validation: new RegExp(/^/),
    validationResponse: 'Please ',
    expectedResponses: [],
    children: [],
  },
  SUPPORT: {
    title: ' ',
    options: [],
    validation: new RegExp(/^/),
    validationResponse: 'Please ',
    expectedResponses: [],
    children: [],
  },
  TERMINATE_BOT: {
    title: 'Thank you for using StoreFront Services ',
    options: [],
    validation: new RegExp(/^/),
    validationResponse: '',
    expectedResponses: [''],
    children: [],
  },
};

const MENU_MAPPINGS = {
  '1': EnTranslations.LISTING_INIT_MESSAGE,
  '2': EnTranslations.MAIN_MENU,
  '2.1': EnTranslations.VIEW_LISTINGS,
  '2.2': EnTranslations.DELETE_LISTING,
  '2.3': EnTranslations.CHANGE_REMINDER_FREQUENCY,
  '2.4.a': EnTranslations.CREATE_TENANT,
  '2.4.b': EnTranslations.CONFIRM_TENANT,
  '2.4.c': EnTranslations.TENANT_STATUS,
  '2.4.d': EnTranslations.CLEAR_TENANT,
  '2.4.e': EnTranslations.BLACKLIST_TENANT,
  '2.4.f': EnTranslations.TERMINATE_LEASE,
  '2.5': EnTranslations.SUPPORT,
  '3': EnTranslations.REGISTRATION_MENU,
  '3.1.1': '',
  '3.2.1': EnTranslations.GET_PHONE_MENU,
  '3.2.2': EnTranslations.CONFIRM_PHONE_MENU,
  '3.2.3': EnTranslations.GET_PIN_MENU,
  '3.2.4': EnTranslations.CONFIRM_PIN_MENU,
  '3.3.1': '',
  '3.4.1': '',
  '4': EnTranslations.TERMINATE_BOT,
};
