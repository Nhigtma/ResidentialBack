import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Users, UsersDocumment } from "src/schemas/user.schema";


@Injectable()
export class UserService {
    constructor(@InjectModel(Users.name) private userModel : Model<UsersDocumment>) {}

    async findOneUser (username: string) {
        return this.userModel.findOne({ username }).exec();
    }
}