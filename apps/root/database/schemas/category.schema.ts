import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import {ApiProperty} from "@nestjs/swagger";
import {AbstractSchema} from "./abstract.schema";

export interface ICategorySchema {
    _id: mongoose.Types.ObjectId;
    name: string;
    code: string;
}

@Schema()
export class Category extends AbstractSchema implements ICategorySchema{
    @ApiProperty({type: String, description: "Название категории", default: "Рекомендованное", required: true})
    @Prop({type: String, required: true})
    name: string;

    @ApiProperty({type: String, description: "Уникальный код категории", default: "recommend", required: true})
    @Prop({type: String, unique: true, required: true})
    code: string;
}

export type CategoryDocument = HydratedDocument<Category>;

export const CategorySchema = SchemaFactory.createForClass(Category);