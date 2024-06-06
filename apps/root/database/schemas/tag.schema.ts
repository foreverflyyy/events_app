import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import {ApiProperty} from "@nestjs/swagger";
import {AbstractSchema} from "./abstract.schema";

export interface ITagSchema {
    _id: mongoose.Types.ObjectId;
    name: string;
    code: string;
}

@Schema()
export class Tag extends AbstractSchema implements ITagSchema {
    @ApiProperty({type: String, description: "Название тега", default: "С животными", required: true})
    @Prop({type: String, required: true})
    name: string;

    @ApiProperty({type: String, description: "Уникальный код тега", default: "pets", required: true})
    @Prop({type: String, unique: true, required: true})
    code: string;
}

export type TagDocument = HydratedDocument<Tag>;

export const TagSchema = SchemaFactory.createForClass(Tag);