import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { question } from "src/interfaces/question.interface";


export type QuestionsDocumment = HydratedDocument<question>

@Schema({timestamps: true})
export class Questions {
    @Prop({required: true})
    description: string;

    @Prop({required: true})
    id_assembly: string;
}

export const QuestionSchema = SchemaFactory.createForClass(Questions)