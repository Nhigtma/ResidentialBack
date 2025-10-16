import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from 'bcrypt';
import { ClientSession, Model } from "mongoose";
import { UserData, UserRetrieved } from "src/interfaces/user.interface";
import { Users, UsersDocumment } from "src/schemas/user.schema";

@Injectable()
export class UserService {
    constructor(@InjectModel(Users.name) private userModel : Model<UsersDocumment>) {}

    async findOneUser (username: any) {
        return this.userModel.findOne({username, active:true}).lean().exec();
    }

    async findOneUserById (id: string) {
        return this.userModel.findById({id, active:true}).lean().exec();
    }

    async createUser(userData: UserData, options?: { session?: ClientSession }) {
        const user = new this.userModel(userData);
        if (await this.userModel.findOne({username: userData.username, active:false})) {
            return await this.updateUserFromHouse(Number(userData.username), userData.password, Number(userData.username), options)
        }
        return await user.save(options);
    }

    async updateUserFromHouse(cc:number, newPassword: string, newUser: number, options?: { session?: ClientSession }) {
        if(!(await this.findOneUser(cc))) {
                throw new NotFoundException("No user founded")
            }
        return await this.userModel.findOneAndUpdate(
            {username: cc},
            {
                $set: {
                    username: newUser,
                    password: newPassword
                }
            },
            options
        )
    }

    private rolDefine (rol:number){
        const r = ["","Residente", "Sub Administrador", "Administrador"]
        return r[rol]
    }

    async getAll () {
        const users = await this.userModel.find({active: true})
        const usersToProcess: UserRetrieved [] = []
        for (let index = 0; index < users.length; index ++) {
            const u = users[index]
            const push = {
                id: u._id,
                username: u.username,
                rol: this.rolDefine(u.rol)
            };
            usersToProcess.push(push)
        }
        return await usersToProcess;
    }

    async DeleteUser (id:string) {
        const session = await this.userModel.db.startSession();

        try {
            await session.startTransaction()

            if(!(await this.findOneUserById(id)) || (await this.userModel.findOne({id, active: false}))) {
                throw new NotFoundException("No user founded")
            }

            await this.userModel.updateOne(
                { _id: id, rol: 2 }, {
                    $set : {
                        active: false
                    }
                },
                {session}
            )

            await session.commitTransaction();
            return "User deleted Succesfully"
        } catch (error) {
            await session.abortTransaction();
                        
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('An unexpected error occurred');
        }finally {
            await session.endSession();
        }
    }
    
    async createUserSubAdmin(userData: UserData) {
        const existingUser = await this.userModel.findOne({
            username: userData.username,
            active: false
        });
    
        if (existingUser) {
            const updatedUser = await this.updateUserFromHouse(
                Number(userData.username),
                userData.password,
                Number(userData.username)
            );

            return {
                id: String(updatedUser?._id || updatedUser?.id),
                username: String(updatedUser?.username),
                password: String(updatedUser?.password),
                rol: String(this.rolDefine(Number(updatedUser?.rol)))
        };
    }
        const user = {
            username: userData.username,
            password: await bcrypt.hash(userData.password, 10),
            rol: 3
        }
        
        const createdUser = await this.userModel.create(user);
        return {
            id: String(createdUser._id),
            username: String(createdUser.username),
            password: String(createdUser.password),
            rol: String(this.rolDefine(createdUser.rol))
        };
    }
}