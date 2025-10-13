import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Assembly } from "src/interfaces/assembly.interface";


export type AssembliesDocumment = HydratedDocument<Assembly>

export enum State {
    PENDING = 'pending',
    STARTED = 'started',
    FINISHED = 'finished',
}

@Schema({timestamps: true})
export class Assemblies {
    @Prop({required: true})
    date: Date;

    @Prop({required: true, default:State.PENDING})
    state: State;
}

export const AssemblySchema = SchemaFactory.createForClass(Assemblies)