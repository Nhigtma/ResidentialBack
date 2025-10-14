import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ClientSession, Model } from "mongoose";
import { Users, UsersDocumment } from "src/schemas/user.schema";

@Injectable()
export class UserService {
    constructor(@InjectModel(Users.name) private userModel : Model<UsersDocumment>) {}

    async findOneUser (username: string) {
        return this.userModel.findOne({username, active:true}).lean().exec();
    }

    async findOneUserById (id: string) {
        return this.userModel.findById({id, active:true}).lean().exec();
    }

    async createUser(userData: any, options?: { session?: ClientSession }) {
        const user = new this.userModel(userData);
        return await user.save(options);
    }
    /*async createUserAdmin() {
    const userData = {
        username: "sre",
        password: await bcrypt.hash("1233", 10), // Encriptar password
        rol: 3
    }
    
    const createdUser = await this.userModel.create(userData);
    return createdUser;
    }*/
}