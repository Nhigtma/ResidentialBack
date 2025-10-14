import { BadRequestException, Controller, InternalServerErrorException, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { multerOptions } from 'src/config/multer.config';
import { HouseData } from 'src/interfaces/house_data.interface';
import { HouseService } from 'src/services/house.service';
import { read, utils } from 'xlsx';

@ApiTags('house')
@ApiBearerAuth()
@Controller('house')
export class HouseController {
  constructor(private houseService: HouseService) {}

  @Post('excel')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  @ApiOperation({
    summary: 'Upload Excel file with house/resident data',
    description: `
Upload an Excel file (.xlsx or .xls) containing house and resident information.

**Excel File Structure Requirements:**

| Column Name       | Description                          | Data Type | Required |
|-------------------|--------------------------------------|-----------|----------|
| CASA/APTO         | House/Apartment identifier           | String    | Yes      |
| NOMBRE_RES        | Resident's full name                 | String    | No       |
| CC_RESIDENTE      | Resident's ID number                 | Number    | No       |
| CEL_RESIDENTE     | Resident's phone number              | Number    | No       |

**Example Excel Data:**
| CASA/APTO | NOMBRE_RES | CC_RESIDENTE | CEL_RESIDENTE |
|-----------|------------|--------------|---------------|
| mamza2    | carlos     | 12342134     | 234234        |
| 26        | juan       | 455345       | 8907768       |

**Important Notes:**
- First row must contain the exact column headers as shown above
- File must be in Excel format (.xlsx or .xls)
- Maximum file size: 5MB
- Empty rows will be ignored
    `
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Excel file with house/resident data',
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Excel file (.xlsx, .xls) with house and resident data'
        },
      },
    },
  })
  async uploadXlsx(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      let workbook;
      if (file.path) {
        workbook = read(file.path, { type: 'file' });
      } else {
        workbook = read(file.buffer, { type: 'buffer' });
      }

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = utils.sheet_to_json(worksheet) as HouseData[];
      return await this.houseService.processExcel(data)
    } catch (error) {
      console.error('Error processing Excel file:', error);
      throw new InternalServerErrorException('Unexpected error happened processing an excel file')
    }
  }
}