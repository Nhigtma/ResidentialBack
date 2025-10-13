import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Assembly } from "src/interfaces/assembly.interface";


export type AssembliesDocumment = HydratedDocument<Assembly>

@Schema({timestamps: true})
export class Assemblies {
    @Prop({required: true})
    date: Date;
}

export const AssemblySchema = SchemaFactory.createForClass(Assemblies)