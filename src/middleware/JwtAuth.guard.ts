import { ExecutionContext, ForbiddenException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    private readonly logger = new Logger(JwtAuthGuard.name);

    constructor(private reflector: Reflector) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        
        const authHeader = request.headers['authorization'];

        if (!authHeader) {
            throw new UnauthorizedException('No token provided');
        }

        const token = authHeader.replace('Bearer ', '');

        try {
            const result = await super.canActivate(context);
            
            const isValid = result instanceof Observable ? await result.toPromise() : result;
            
            if (!isValid) {
                return false;
            }

            const requiredPermission = this.reflector.get<number>('requiredPermission', context.getHandler());
            const user = request.user;

            if (requiredPermission !== undefined && user) {
                if (user.permissionLevel < requiredPermission) {
                    throw new ForbiddenException('Insufficient permissions');
                }
            }

            return true;
            
        } catch (error) {
            throw error;
        }
    }
}