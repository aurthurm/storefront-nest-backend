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
    validation: '',
    validationResponse: 'Invalid Response',
    expectedResponses: ['Hi'],
  },

  REGISTRATION_MENU: {
    title: ' Welcome to StoreFront Services \nRegistration Menu',
    options: [
      '1. Activate Account (Listed from Advertiser (Use prefix e.g. +263 771 123456)',
      '2. New Account Registration & Activation',
      '3. Change Account Number',
      '4. Support',
    ],
    validation: '',
    validationResponse: 'Please choose one of the following options: 1,2,3,4',
    expectedResponses: [1, 2, 3, 4],
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
    validation: '',
    validationResponse: 'Please choose one of the following options: 1,2,3,4,a,b,c,d,e,5,6',
    expectedResponses: [1, 2, 3, "a", "b", "c", "d", "e", 5, 6],
  },
  TERMINATE_BOT: {
    title: 'Thank you for using StoreFront Services ',
    options: [],
    validation: '',
    validationResponse: '',
    expectedResponses: [''],
  },
};
