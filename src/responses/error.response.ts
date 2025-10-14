import { ApiProperty } from "@nestjs/swagger";

export class ErrorResponse {
    @ApiProperty()
    message: string;

    @ApiProperty()
    error: string;

    @ApiProperty()
    statusCode: number;
}