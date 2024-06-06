import {ApiProperty} from "@nestjs/swagger";
import {AbstractSchema} from "./abstract.schema";
import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface ICmsUserSchema {
    _id: mongoose.Types.ObjectId;
    name: string;
    login: string;
    password: string;
    role: string;
}

@Schema()
export class CmsUser extends AbstractSchema implements ICmsUserSchema {
    @ApiProperty({type: String, description: "Основной id пользователя", required: true})
    @Prop({type: String, required: true})
    userId: string;

    @ApiProperty({type: String, description: "Имя", default: "Василий", required: true})
    @Prop({type: String, required: true})
    name: string;

    @ApiProperty({type: String, description: "Уникальный логин", default: "login", required: true})
    @Prop({type: String, unique: true, required: true})
    login: string;

    @ApiProperty({type: String, description: "Пароль", default: "password", required: true})
    @Prop({type: String, required: true})
    password: string;

    @ApiProperty({type: String, description: "Роль пользователя", default: "", required: true})
    @Prop({type: String, required: true})
    role: string;
}

export type CmsSchemaDocument = HydratedDocument<CmsUser>;

export const CmsUserSchema = SchemaFactory.createForClass(CmsUser);