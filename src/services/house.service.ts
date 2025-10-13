import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HouseData } from 'src/interfaces/house_data.interface';
import { Houses, HousesDocument } from 'src/schemas/house.schema';

@Injectable()
export class HouseService {
    constructor(@InjectModel(Houses.name) private houseModel : Model<HousesDocument>) {}

    async processExcel (data: HouseData[]) {
        let position = 1
        for (const house of data){
            console.log(house['CASA/APTO'])
            if (!house['CASA/APTO'] && (house.CC_RESIDENTE || house.CEL_RESIDENTE || house.NOMBRE_RESIDENTE)) {
                throw new BadRequestException('There is an unnamed house with resident data in position ', String(position))
            }
            position ++
        }
    }
}
