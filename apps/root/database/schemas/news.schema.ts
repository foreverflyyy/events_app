import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import mongoose, {HydratedDocument, SchemaTypes} from 'mongoose';
import {ApiProperty} from "@nestjs/swagger";
import {AbstractSchemaWithImages} from "./abstract.schema";

const ObjectId = mongoose.Schema.Types.ObjectId;

export interface INewsSchema {
    _id: mongoose.Types.ObjectId;
    userId: string | mongoose.Types.ObjectId | null;
    eventId: string | mongoose.Types.ObjectId | null;
    text: string;
    images: string[];
    tags: string[];
    countLikes: number;
    active: boolean;
    comments: string[];
    lastChange: Date;
    createdAt: Date;
}

@Schema()
export class News extends AbstractSchemaWithImages implements INewsSchema{
    @ApiProperty({type: String, required: false, default: ""})
    @Prop({type: ObjectId, ref: 'User'})
    userId: string | mongoose.Types.ObjectId | null;

    @ApiProperty({type: String, required: false, default: ""})
    @Prop({type: ObjectId, ref: 'Event'})
    eventId: string | mongoose.Types.ObjectId | null;

    @ApiProperty({type: String, description: "Текст новости", default: "Текст новости", required: true})
    @Prop({type: String, default: "", required: true})
    text: string;

    // @ApiProperty({type: [String], description: "Картинки новости", default: [], required: false})
    // @Prop({type: [String], default: []})
    // images: string[];

    @ApiProperty({type: [String], description: "Теги новости", default: [], required: false})
    @Prop({type: [SchemaTypes.ObjectId], default: []})
    tags: string[];

    @ApiProperty({type: [String], description: "Кол-во лайков", default: 0, required: false})
    @Prop({type: Number, default: 0})
    countLikes: number;

    @ApiProperty({type: Boolean, description: "Флаг доступности", default: true, required: false})
    @Prop({type: Boolean, default: true})
    active: boolean;

    @ApiProperty({type: [String], description: "Список комментариев", default: [], required: false})
    @Prop({type: [SchemaTypes.ObjectId], default: []})
    comments: string[];

    @ApiProperty({type: String, description: "Последнее изменене", default: Date.now(), required: false})
    @Prop({type: Date, default: Date.now()})
    lastChange: Date;

    @ApiProperty({type: String, description: "Дата создания новости"})
    @Prop({type: Date, default: Date.now()})
    createdAt: Date;
}

export type NewsDocument = HydratedDocument<News>;

export const NewsSchema = SchemaFactory.createForClass(News);