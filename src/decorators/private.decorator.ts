import { SetMetadata } from '@nestjs/common';
import { AccountType } from 'src/domains/auth/auth.type';

export const IS_PUBLIC_KEY = 'isPublic';
export const Private = (accountType: AccountType) =>
  SetMetadata('accountType', accountType);
