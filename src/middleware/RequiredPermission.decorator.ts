import { SetMetadata } from '@nestjs/common';

export const RequiredPermission = (permission: number) => SetMetadata('requiredPermission', permission);