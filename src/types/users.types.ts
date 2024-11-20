import { User } from '@prisma/client';

export type UserLoginCredentials = Pick<User, 'password'> &
  Partial<Pick<User, 'email' | 'username'>>;

export type UserTokenPayload = Pick<User, 'email' | 'username' | 'id' | 'isVerified' | 'fullname'>;

export type UpdateUser = Partial<Pick<User, 'fullname' | 'isVerified'>>;
