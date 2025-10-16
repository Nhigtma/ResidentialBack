import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { HouseData, HousesRetrieve, UpdateHouseInterface } from 'src/interfaces/house_data.interface';
import { Houses, HousesDocument } from 'src/schemas/house.schema';
import { UserService } from './user.service';

@Injectable()
export class HouseService {
    constructor(
        @InjectModel(Houses.name) private houseModel: Model<HousesDocument>,
        private userService: UserService
    ) {}

    private generatePassword(ccNumber: number, phoneNumber: number): string {
    const cc = ccNumber?.toString() || '';
    const cel = phoneNumber?.toString() || '';
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

                if (shouldProcess) {
                    housesToProcess.push(house);
                }
            }

            for (let index = 0; index < housesToProcess.length; index++) {
                const house = housesToProcess[index];

                const userData = {
                    username: house.CC_RESIDENTE.toString(),
                    password: await bcrypt.hash(this.generatePassword(house.CC_RESIDENTE, house.CEL_RESIDENTE), 10),
                    rol: 1
                };

                const user = await this.userService.createUser(userData, { session });

                const houseModel = {
                    serial: house['CASA/APTO'],
                    name_resident: house.NOMBRE_RESIDENTE,
                    cc_resident: house.CC_RESIDENTE,
                    phone_resident: house.CEL_RESIDENTE,
                    id_user: String(user?._id)
                };
                if (await this.houseModel.findOne({serial: houseModel.serial})){
                    throw new BadRequestException('Already exists a house with that serial')
                }
                await this.houseModel.create([houseModel], { session });
                insertedHouses.push(houseModel);
            }

            await session.commitTransaction();
            return insertedHouses;

        } catch (error) {
            await session.abortTransaction();
            
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
            return false;
        }

        if (hasResidentData && (!houseName || !houseName.toString().trim())) {
            throw new BadRequestException(`There is an unnamed house with resident data on row ${index + 1}`);
        }

        const hasAllResidentData = house.CC_RESIDENTE && house.CEL_RESIDENTE && house.NOMBRE_RESIDENTE;
        
        if (!hasAllResidentData) {
            throw new BadRequestException(`There is incomplete resident data on row ${index + 1}`);
        }

        if (houseName && !houseName.toString().trim()) {
            throw new BadRequestException(`House name cannot be blank on row ${index + 1}`);
        }
        
        if (!house.NOMBRE_RESIDENTE.toString().trim()) {
            throw new BadRequestException(`Resident name cannot be blank on row ${index + 1}`);
        }

        if (isNaN(Number(house.CC_RESIDENTE))) {
            throw new BadRequestException(`CC must be a number on row ${index + 1}`);
        }
        
        if (isNaN(Number(house.CEL_RESIDENTE))) {
            throw new BadRequestException(`Cell number must be a number on row ${index + 1}`);
        }

        const cc = Number(house.CC_RESIDENTE);
        const ccValidation = !isNaN(cc) && cc > 0 && cc <= 9999999999 && house.CC_RESIDENTE.toString().length >= 6 && house.CC_RESIDENTE.toString().length <= 10;        if (!ccValidation) {
            throw new BadRequestException(`Invalid CC number on row ${index + 1}`);
        }

        const cel = Number(house.CEL_RESIDENTE);
        const celValidation = !isNaN(cel) && cel > 0 && cel <= 9999999999 && house.CEL_RESIDENTE.toString().length === 10;        if (!celValidation) {
            throw new BadRequestException(`Invalid cell number on row ${index + 1}`);
        }

        return true;
    }

    async getAll () {
        const houses = await this.houseModel.find()
        const housesToProcess: HousesRetrieve [] = []
        for (let index = 0; index < houses.length; index ++) {
            const h = houses[index]
            const or = {
                id: h._id,
                'casa/apto':h.serial,
                'name_resident':h.name_resident,
                'cc_resident':h.cc_resident,
                'phone_resident':h.phone_resident
            };
            housesToProcess.push(or);
        }
        return await housesToProcess;
    }

    private updateValidation(house : UpdateHouseInterface) {

        const hasResidentData = house.cc_resident || house.phone_resident || house.name_resident;

        if (!hasResidentData) {
            return false;
        }

                const hasAllResidentData = house.cc_resident && house.phone_resident && house.name_resident;
        
        if (!hasAllResidentData) {
            throw new BadRequestException(`There is incomplete resident data`);
        }

        if (!house.name_resident?.toString().trim()) {
            throw new BadRequestException(`Resident name cannot be blank`);
        }

        if (isNaN(Number(house.cc_resident))) {
            throw new BadRequestException(`CC must be a number`);
        }
        
        if (isNaN(Number(house.phone_resident))) {
            throw new BadRequestException(`Cell number must be a number`);
        }

        const cc = Number(house.cc_resident);
        const ccValidation = !isNaN(cc) && cc > 0 && cc <= 9999999999 && house.cc_resident?.toString().length >= 6 && house.cc_resident?.toString().length <= 10;
        if (!ccValidation) {
            throw new BadRequestException(`Invalid CC number`);
        }

        const cel = Number(house.phone_resident);
        const celValidation = !isNaN(cel) && cel > 0 && cel <= 9999999999 && house.phone_resident.toString().length === 10;
        if (!celValidation) {
            throw new BadRequestException(`Invalid cell number`);
        }

        return true;
    }

    async update (updateData: UpdateHouseInterface) {
        const session = await this.houseModel.db.startSession();
        try {
            await session.startTransaction();
            await this.updateValidation(updateData);
            const before = await this.houseModel.findById(
                updateData.id
            )
            if (!before) {
                throw new NotFoundException('House not found')
            }
            const h = await this.houseModel.findByIdAndUpdate(
                updateData.id,
                { $set: {
                    ...(updateData.cc_resident && { cc_resident: updateData.cc_resident }),
                    ...(updateData.name_resident && { name_resident: updateData.name_resident }),
                    ...(updateData.phone_resident && { phone_resident: updateData.phone_resident })
                }
                },
                {session,
                    new: true
                }
            );

            const newPassword = await bcrypt.hash(this.generatePassword(updateData.cc_resident, updateData.phone_resident), 10)

            await this.userService.updateUserFromHouse(Number(before?.cc_resident), newPassword, updateData.cc_resident, {session});
            await session.commitTransaction();

            return await {
                "id": updateData.id.toString(),
                "casa/apto": String(h?.serial),
                name_resident: String(h?.name_resident),
                cc_resident : Number(h?.cc_resident),
                phone_resident: Number(h?.phone_resident)
            };
        } catch (error) {
            await session.abortTransaction();

            if (error instanceof NotFoundException) {
            throw error;
            }

            throw new InternalServerErrorException("An unexpected error occurred while inserting data");
        } finally {
            await session.endSession();
        }
    }
}