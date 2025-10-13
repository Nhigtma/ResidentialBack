import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { LoginDto } from 'src/dtos/login.dto';
import { ErrorResponse, LoginResponse } from 'src/responses/auth.responses';
import { AuthService } from 'src/services/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
constructor(private authService: AuthService) {}

@Post('login')
@HttpCode(200)
@ApiOkResponse({
    description: 'Sign in successfully',
    type: LoginResponse
})
@ApiBadRequestResponse({
    description: 'Missing credential',
    type: ErrorResponse
})
@ApiUnauthorizedResponse({
    description: 'Invalid credentials',
    type: ErrorResponse
})

async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    return await this.authService.login(loginDto)
    }
}
