import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { User } from "src/interfaces/user.interface";


export type UsersDocumment = HydratedDocument<User>;

@Schema({timestamps: true})
export class Users {
    @Prop({required: true, default: true})
    active: boolean;
    
    @Prop({required: true})
    username: string;

    @Prop({required: true})
    password: string;

    @Prop({required: true})
    rol: number;
}

export const UserSchema = SchemaFactory.createForClass(Users)