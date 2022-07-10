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
};
