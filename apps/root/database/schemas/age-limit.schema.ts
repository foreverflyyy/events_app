import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import {ApiProperty} from "@nestjs/swagger";
import {AbstractSchema} from "./abstract.schema";

export interface IAgeLimitSchema {
    _id: mongoose.Types.ObjectId;
    name: string;
    code: string;
    startWith: number;
}

@Schema()
export class AgeLimit extends AbstractSchema implements IAgeLimitSchema{
    @ApiProperty({type: String, description: "Название в.о", default: "18+", required: true})
    @Prop({type: String, required: true})
    name: string;

    @ApiProperty({type: String, description: "Уникальный код возраста", default: "eighteen", required: true})
    @Prop({type: String, unique: true, required: true})
    code: string;

    @ApiProperty({type: String, description: "С какого возраста", default: 18, required: true})
    @Prop({type: String, required: true})
    startWith: number;
}

export type AgeLimitDocument = HydratedDocument<AgeLimit>;

export const AgeLimitSchema = SchemaFactory.createForClass(AgeLimit);