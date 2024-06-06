import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import mongoose, {HydratedDocument} from 'mongoose';
import {ApiProperty} from "@nestjs/swagger";
import {AbstractSchemaWithMainImage} from "./abstract.schema";

export interface IAchievementSchema {
    _id: mongoose.Types.ObjectId;
    name: string;
    code: string;
    mainImage: string;
}

@Schema()
export class Achievement extends AbstractSchemaWithMainImage implements IAchievementSchema{
    @ApiProperty({type: String, description: "Название достижения", default: "Барин", required: true})
    @Prop({type: String, required: true})
    name: string;

    @ApiProperty({type: String, description: "Уникальный код достижения", default: "barin", required: true})
    @Prop({type: String, unique: true, required: true})
    code: string;
}

export type AchievementDocument = HydratedDocument<Achievement>;

export const AchievementSchema = SchemaFactory.createForClass(Achievement);