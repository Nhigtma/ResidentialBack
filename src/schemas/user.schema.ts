import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { User } from "src/interfaces/user.interface";


export type UsersDocumment = HydratedDocument<User>;

@Schema({timestamps: true})
export class Users {
    @Prop({required: true, unique: true})
    username: string;

    @Prop({required: true})
    password: string
}

export const UserSchema = SchemaFactory.createForClass(Users)