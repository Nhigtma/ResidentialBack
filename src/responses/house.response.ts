import { ApiProperty } from "@nestjs/swagger";


export class ExcelResponse {
    @ApiProperty()
    serial: string | number;
    
    @ApiProperty()
    name_resident: string;

    @ApiProperty()
    cc_resident: number;

    @ApiProperty()
    phone_resident: number;

    @ApiProperty()
    id_user: string;
}

export class GetAllResponse {
    @ApiProperty()
    id: string;
    
    @ApiProperty()
    'casa/apto': string|number;

    @ApiProperty()
    'name_resident': string;

    @ApiProperty()
    cc_resident: number;

    @ApiProperty()
    phone_resident: string;
}

