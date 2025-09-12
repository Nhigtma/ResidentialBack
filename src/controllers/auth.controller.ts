import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from 'src/middleware/guards/local-auth.guard';
import { AuthService } from 'src/services/auth.service';

@Controller('auth')
export class AuthController {
constructor(private authService: AuthService) {}

@UseGuards(LocalAuthGuard)
@Post('login')
login(@Request() req) {
    return this.authService.login(req.User)
}
}
