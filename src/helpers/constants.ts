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

  LOGIN: {
    title: 'Please login with your 4 digit pin',
    options: [],
    validation: new RegExp(/^[0-9]{4}$/),
    validationResponse: 'Invalid Pin. Please login with your 4 digit pin',
    expectedResponses: [],
    children: [],
  },

  REGISTRATION_MENU: {
    title: ' Welcome to StoreFront Services \nRegistration Menu',
    options: [
      '1. Activate Account (Listed from Advertiser)',
      '2. New Account Registration & Activation',
      '3. Change Account Number',
      '4. Support',
    ],
    validation: new RegExp(/^[1-4]{1}$/),
    validationResponse: 'Please choose one of the following options: 1,2,3,4',
    expectedResponses: [1, 2, 3, 4],
    children: ['3.0', '3.1', '3.2', '3.3', '3.4'],
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

  GET_PHONE_EXISTING_MENU: {
    title:
      'Please enter existing Account Number (With prefix e.g., 263 771 456789)',
    options: [],
    validation: new RegExp(/^(\263|0)7[7-8|1|3][0-9]{7}$/),
    validationResponse: 'Invalid Phone number',
    expectedResponses: [],
    children: [],
  },

  CONFIRM_EXISTING_PHONE_MENU: {
    title: 'Enter confirmation code',
    options: [],
    validation: new RegExp(/^[0-9]{4}$/),
    validationResponse: 'Invalid Confimation code',
    expectedResponses: [],
    children: [],
  },

  CONFIRM_PHONE_MENU: {
    title: 'Confirm Account',
    options: [],
    validation: new RegExp(/^[0-9]{4}$/), // new RegExp(/^(\+263|0)7[7-8|1|3][0-9]{7}$/),
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
      '4. Ternant Services',
      '5. End / Terminate Lease Subscribe',
      '6. Support',
    ],
    validation: new RegExp(/^[1-6]{1}$/),
    validationResponse:
      'Please choose one of the following options: 1,2,3,4,5,6',
    expectedResponses: [1, 2, 3, 4, 5, 6],
    children: [],
  },

  VIEW_LISTINGS: {
    title: 'Your Listings',
    options: [],
    validation: new RegExp(/^/),
    validationResponse: 'Please ',
    expectedResponses: [],
    children: [],
  },

  DELETE_LISTING: {
    title: 'Enter Listing Reference',
    options: [],
    validation: new RegExp(/^/),
    validationResponse: 'Please ',
    expectedResponses: [],
    children: [],
  },

  CONFIRM_DELETE_LISTING: {
    title: 'Confirm Delete Listing ',
    options: [],
    validation: new RegExp(/^y|n/),
    validationResponse: 'Please ',
    expectedResponses: ['y', 'n'],
    children: [],
  },

  CHANGE_REMINDER_FREQUENCY: {
    title: 'Change Reminder Frequency ',
    options: [],
    validation: new RegExp(/^/),
    validationResponse: 'Please ',
    expectedResponses: [],
  },

  TENANT_SERVICES: {
    title: 'Tenant Services',
    options: [
      '1. Create Tenant',
      '2. Confirm Tenant',
      '3. Check My Tenancy Status',
      '4. Tenant Clearing Check',
      '5. Blacklist / Unblacklist Tenant',
    ],
    validation: new RegExp(/^/),
    validationResponse: 'Please ',
    expectedResponses: [],
    children: [],
  },

  CREATE_TENANT: {
    title: 'Create Tenant ',
    options: [],
    validation: new RegExp(/^/),
    validationResponse: 'Please ',
    expectedResponses: [],
    children: [],
  },

  CONFIRM_TENANT: {
    title: 'Confirm Tenant',
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
  '1.1': EnTranslations.LOGIN,
  '2': EnTranslations.MAIN_MENU,
  '2.1.1': EnTranslations.VIEW_LISTINGS,
  '2.2.1': EnTranslations.DELETE_LISTING,
  '2.2.2': EnTranslations.CONFIRM_DELETE_LISTING,
  '2.3.1': EnTranslations.CHANGE_REMINDER_FREQUENCY,
  '2.4': 'Tenant Service',
  '2.4.1': EnTranslations.CREATE_TENANT,
  '2.4.2': EnTranslations.CONFIRM_TENANT,
  '2.4.3': EnTranslations.TENANT_STATUS,
  '2.4.4': EnTranslations.CLEAR_TENANT,
  '2.4.5': EnTranslations.BLACKLIST_TENANT,
  '2.4.6': EnTranslations.TERMINATE_LEASE,
  '2.5': EnTranslations.SUPPORT,
  '3': EnTranslations.REGISTRATION_MENU,
  '3.1.1': 'Activation',
  '3.2.1': EnTranslations.CONFIRM_PHONE_MENU,
  '3.2.2': EnTranslations.GET_PIN_MENU,
  '3.2.3': EnTranslations.CONFIRM_PIN_MENU,
  '3.3.1': 'Change account',
  '3.4.1': 'Support',
  '4': EnTranslations.TERMINATE_BOT,
};
