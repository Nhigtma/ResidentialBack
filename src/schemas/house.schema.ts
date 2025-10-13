import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { House } from "src/interfaces/house.interface";


export type HousesDocument = HydratedDocument<House>

@Schema({timestamps: true})
export class Houses {
    @Prop({required: true})
    serial: string;

    @Prop({required: false, default: ""})
    name_resident: string;

    @Prop({required: false, default: NaN})
    cc_resident: number;

    @Prop({required: false, default: NaN})
    phone_resident: number;

    @Prop({required: false, default: ""})
    id_user: string;
}

export const HouseSchema = SchemaFactory.createForClass(Houses)