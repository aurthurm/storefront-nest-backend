import { Role } from './constants';

export const SUPER_USER = {
  userName: 'admin',
  email: 'admin@instore.com',
  firstName: 'Admin',
  lastName: 'Admin',
  middleName: '',
  name: 'Administrator',
  status: 'active',
  roles: [Role.SU_ADMIN],
  pin: '0000',
  phone: '0000',
  password: 'admin',
  address: '',
  requirePinChange: true,
  requirePasswordChange: true,
};
