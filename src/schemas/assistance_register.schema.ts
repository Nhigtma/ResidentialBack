import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { assistance_register } from "src/interfaces/assistance_registers.interface";

export type AssistanceRegistersDocumment = HydratedDocument<assistance_register>

@Schema({timestamps: true})
export class Assistance_registers {
    @Prop({required: true, default: false})
    assisted: boolean;

    @Prop({required: true})
    id_user: string;

    @Prop({required: true})
    id_assembly: string;
}

export const AssistanceRegisterSchema = SchemaFactory.createForClass(Assistance_registers)