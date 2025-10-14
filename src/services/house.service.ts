import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { HouseData } from 'src/interfaces/house_data.interface';
import { Houses, HousesDocument } from 'src/schemas/house.schema';
import { UserService } from './user.service';

@Injectable()
export class HouseService {
    constructor(
        @InjectModel(Houses.name) private houseModel: Model<HousesDocument>,
        private userService: UserService
    ) {}

    private generatePassword(house: any): string {
        const cc = house.CC_RESIDENTE?.toString() || '';
        const cel = house.CEL_RESIDENTE?.toString() || '';
        const first4CC = cc.substring(0, 4);
        const last4Cel = cel.substring(cel.length - 4);
        return `${first4CC}${last4Cel}`;
    }

    async processExcel(data: HouseData[]) {
        const session = await this.houseModel.db.startSession();
        
        try {
            await session.startTransaction();
            
            const insertedHouses: Array<{
                serial: string | number;
                name_resident: string;
                cc_resident: number;
                phone_resident: number;
                id_user: string;
            }> = [];

            const housesToProcess: HouseData[] = [];
            
            for (let index = 0; index < data.length; index++) {
                const house = data[index];
                
                const shouldProcess = await this.shouldProcessHouse(house, index);
                
                console.log(shouldProcess);

                if (shouldProcess) {
                    housesToProcess.push(house);
                }
            }

            for (let index = 0; index < housesToProcess.length; index++) {
                const house = housesToProcess[index];

                console.log(this.generatePassword(house))

                const userData = {
                    username: house.CC_RESIDENTE.toString(),
                    password: await bcrypt.hash(this.generatePassword(house), 10),
                    rol: 1
                };

                const user = await this.userService.createUser(userData, { session });

                const houseModel = {
                    serial: house['CASA/APTO'],
                    name_resident: house.NOMBRE_RESIDENTE,
                    cc_resident: house.CC_RESIDENTE,
                    phone_resident: house.CEL_RESIDENTE,
                    id_user: user._id
                };

                await this.houseModel.create([houseModel], { session });
                insertedHouses.push(houseModel);
            }

            await session.commitTransaction();
            console.log(insertedHouses);
            return insertedHouses;

        } catch (error) {
            await session.abortTransaction();
            console.error('Transaction aborted:', error.message);
            
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('An unexpected error occurred while inserting data');
        } finally {
            await session.endSession();
        }
    }

    private shouldProcessHouse(house: HouseData, index: number): boolean {
        const hasResidentData = house.CC_RESIDENTE || house.CEL_RESIDENTE || house.NOMBRE_RESIDENTE;
        const houseName = house['CASA/APTO'];

        if (!hasResidentData) {
            console.log('trigged')
            return false;
        }

        if (hasResidentData && (!houseName || !houseName.toString().trim())) {
            console.log('trigged')
            throw new BadRequestException(`There is an unnamed house with resident data on row ${index + 1}`);
        }

        const hasAllResidentData = house.CC_RESIDENTE && house.CEL_RESIDENTE && house.NOMBRE_RESIDENTE;
        
        if (!hasAllResidentData) {
            console.log('trigged')
            throw new BadRequestException(`There is incomplete resident data on row ${index + 1}`);
        }

        if (houseName && !houseName.toString().trim()) {
            console.log('trigged')
            throw new BadRequestException(`House name cannot be blank on row ${index + 1}`);
        }
        
        if (!house.NOMBRE_RESIDENTE.toString().trim()) {
            console.log('trigged')
            throw new BadRequestException(`Resident name cannot be blank on row ${index + 1}`);
        }

        if (isNaN(Number(house.CC_RESIDENTE))) {
            console.log('trigged')
            throw new BadRequestException(`CC must be a number on row ${index + 1}`);
        }
        
        if (isNaN(Number(house.CEL_RESIDENTE))) {
            console.log('trigged')
            throw new BadRequestException(`Cell number must be a number on row ${index + 1}`);
        }

        const cc = Number(house.CC_RESIDENTE);
        console.log(house.CC_RESIDENTE.toString())
        const ccValidation = !isNaN(cc) && cc > 0 && cc <= 9999999999 && house.CC_RESIDENTE.toString().length >= 6 && house.CC_RESIDENTE.toString().length <= 10;        if (!ccValidation) {
            console.log('trigged')
            throw new BadRequestException(`Invalid CC number on row ${index + 1}`);
        }

        const cel = Number(house.CEL_RESIDENTE);
        console.log(house.CEL_RESIDENTE.toString())
        const celValidation = !isNaN(cel) && cel > 0 && cel <= 9999999999 && house.CEL_RESIDENTE.toString().length === 10;        if (!celValidation) {
            console.log('trigged')
            throw new BadRequestException(`Invalid cell number on row ${index + 1}`);
        }

        return true;
    }
}