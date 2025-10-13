import { ApiProperty } from "@nestjs/swagger";

export class LoginResponse {
    @ApiProperty()
    access_token: string;

    @ApiProperty()
    rol: number
}

export class ErrorResponse {
    @ApiProperty()
    message: string;

    @ApiProperty()
    error: string;

    @ApiProperty()
    statusCode: number;
}