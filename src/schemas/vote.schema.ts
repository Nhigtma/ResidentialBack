import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Vote } from "src/interfaces/vote.interface";


export type VotesDocumment = HydratedDocument<Vote>

@Schema({timestamps: true})
export class Votes {
    @Prop({required: false})
    on_favor: boolean;

    @Prop({required: true})
    id_question: string;

    @Prop({required: true})
    id_user: string;
}

export const VoteSchema = SchemaFactory.createForClass(Votes)