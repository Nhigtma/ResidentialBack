import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class UpdateHouse {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly id: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly name_resident: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    readonly cc_resident: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    readonly phone_resident: number;
}