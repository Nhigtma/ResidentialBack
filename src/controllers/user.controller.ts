import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UserCreated } from 'src/dtos/create_subuser.dto';
import { UserAfterCreate, UserRetrieved } from 'src/interfaces/user.interface';
import { JwtAuthGuard } from 'src/middleware/JwtAuth.guard';
import { RequiredPermission } from 'src/middleware/RequiredPermission.decorator';
import { ErrorResponse } from 'src/responses/error.response';
import { UserService } from '../services/user.service';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    @RequiredPermission(3)
    @ApiOkResponse({
        description: 'Retrieves a list of users',
        type: [UserRetrieved]
    })
    @ApiUnauthorizedResponse({
        description: 'No token provided',
        type: ErrorResponse
    })
    @ApiForbiddenResponse({
        description: 'Insufficient permissions',
        type: ErrorResponse
    })
    @ApiNotFoundResponse({
        description: 'User not found',
        type: ErrorResponse
    })
    @ApiInternalServerErrorResponse({
        description: 'An unexpected error',
        type: ErrorResponse
    })
    @ApiOperation({
        summary: 'Retrieves a list of all users, permission required to use it 3'
    })
    async GetAllUsers () : Promise<UserRetrieved[]> {
        return await this.userService.getAll();
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @RequiredPermission(3)
    @ApiOkResponse({
        description: 'Creates an user account as a sub admin',
        type: UserAfterCreate
    })
    @ApiUnauthorizedResponse({
        description: 'No token provided',
        type: ErrorResponse
    })
    @ApiForbiddenResponse({
        description: 'Insufficient permissions',
        type: ErrorResponse
    })
    @ApiInternalServerErrorResponse({
        description: 'An unexpected error',
        type: ErrorResponse
    })
    @ApiOperation({
        summary: 'Creates an user account as a sub admin, permission required to use it 3'
    })
    async CreateSubAdmin (@Body() createUser: UserCreated): Promise<UserAfterCreate> {
        const user = {
            username: createUser.username,
            password: createUser.password,
            rol: 2
        }
        return await this.userService.createUserSubAdmin (user);
    }

    @Delete()
    @UseGuards(JwtAuthGuard)
    @RequiredPermission(3)
    @ApiOkResponse({
        description: 'Deletes an user account',
        type: "User deleted Succesfully"
    })
    @ApiUnauthorizedResponse({
        description: 'No token provided',
        type: ErrorResponse
    })
    @ApiForbiddenResponse({
        description: 'Insufficient permissions',
        type: ErrorResponse
    })
    @ApiNotFoundResponse({
        description: 'User not found',
        type: ErrorResponse
    })
    @ApiInternalServerErrorResponse({
        description: 'An unexpected error',
        type: ErrorResponse
    })
    @ApiOperation({
        summary: 'Deletes an user account, permission required to use it 3'
    })
    async DeleteUser (@Param('id') id:string) {
        return await this.userService.DeleteUser(id);
    }

}
