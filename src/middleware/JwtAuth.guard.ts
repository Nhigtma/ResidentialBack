import { ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    async canActivate(context: ExecutionContext) {

        const isValid = await super.canActivate(context);
        if (!isValid) {
            return false;
        }


        const requiredPermission = this.reflector.get<number>('requiredPermission', context.getHandler());
        
        if (requiredPermission === undefined) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (user.permissionLevel < requiredPermission) {
            throw new ForbiddenException('Insufficient permissions');
        }

        return true;
    }
}