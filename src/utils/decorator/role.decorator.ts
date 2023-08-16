import { SetMetadata } from '@nestjs/common';
import RoleType from '@util/enum/role-type.enum';

export const ALLOWED_ROLE = 'ALLOWED_ROLE';
export const ROLE_ACCESS = (...role: string[]) => SetMetadata(ALLOWED_ROLE, RoleType.ADMINISTRATOR);
