import { ROLES } from './constants';
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: ROLES[]): any => SetMetadata('roles', roles);
