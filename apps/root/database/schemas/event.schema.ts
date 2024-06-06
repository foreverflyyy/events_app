import mongoose, {HydratedDocument, Schema as MongooseSchema} from 'mongoose';
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {ApiProperty} from "@nestjs/swagger";
import {AbstractSchemaWithMainAndExtraImages} from "./abstract.schema";

const ObjectId = mongoose.Schema.Types.ObjectId;

export enum EventCurrency {
    RUB = "RUB"
}

export enum EventStatus {
    MODERATION = "moderation",
    WILL_BE = "will be",
    RIGHT_NOW = "right now",
    COMPLETED = "completed"
}

export class EventDate {
    @ApiProperty({type: Date, description: "Дата начала", required: true, default: "2024-05-18T14:10:30Z"})
    @Prop({type: String, required: true})
    dateStart: Date;

    @ApiProperty({type: Date, description: "Дата окончания", required: true, default: "2024-05-28T18:10:30Z"})
    @Prop({type: String, required: true})
    dateEnd: Date;
}

export interface IEventSchema {
    _id: mongoose.Types.ObjectId;
    author: string;
    name: string;
    description: string;
    date: EventDate[];
    city: string;
    place: string;
    address: string;
    mainImage: string;
    images: string[];
    ageLimit: string | mongoose.Types.ObjectId | null;
    price: number;
    currency: EventCurrency;
    tags: string[];
    news: string[];
    categories: string[];
    participants: string[];
    organizers: string[];
    marked: string[];
    status: EventStatus;
}

@Schema()
export class Event extends AbstractSchemaWithMainAndExtraImages implements IEventSchema{
    @ApiProperty({type: String, required: true, default: "Id создателя мероприятия"})
    @Prop({type: String, required: true})
    author: string;

    @ApiProperty({type: String, required: true, default: "Яндекс конференция"})
    @Prop({type: String, required: true})
    name: string;

    @ApiProperty({type: String, required: false, default: "Хорошее мероприятие"})
    @Prop({type: String, default: ""})
    description: string;

    @ApiProperty({type: [EventDate], required: true, description: "Даты начал и концов мероприятий"})
    @Prop({type: MongooseSchema.Types.Array, required: true})
    date: EventDate[];

    @ApiProperty({type: String, required: true, description: "Город", default: "Калининград"})
    @Prop({type: String, required: true})
    city: string;

    @ApiProperty({type: String, required: true, description: "Название здания (места)", default: "Moscow city"})
    @Prop({type: String, required: true})
    place: string;

    @ApiProperty({type: String, required: false, description: "Id адреса"})
    @Prop({type: String, required: true})
    address: string;

    @ApiProperty({type: String, required: false, default: ""})
    @Prop({type: ObjectId, ref: 'Achievement'})
    ageLimit: string | mongoose.Types.ObjectId | null;

    @ApiProperty({type: Number, required: false, description: "Цена", default: 0})
    @Prop({type: Number, default: 0})
    price: number;

    @ApiProperty({type: String, required: false, description: "Курс мероприятия", default: "RUB"})
    @Prop({type: String, enum: EventCurrency, default: EventCurrency.RUB})
    currency: EventCurrency;

    @ApiProperty({type: [String], required: false, description: "Теги", default: []})
    @Prop({type: [{type: ObjectId, ref: 'Tag'}], default: []})
    tags: string[];

    @ApiProperty({type: [String], required: false, description: "Новости", default: []})
    @Prop({type: [{type: ObjectId, ref: 'News'}], default: []})
    news: string[];

    @ApiProperty({type: [String], required: false, description: "Категории", default: []})
    @Prop({type: [{type: ObjectId, ref: 'Category'}], default: []})
    categories: string[];

    @ApiProperty({type: [String], required: false, description: "Участники", default: []})
    @Prop({type: [{type: ObjectId, ref: 'User'}], default: []})
    participants: string[];

    @ApiProperty({type: [String], required: false, description: "Организаторы", default: []})
    @Prop({type: [{type: ObjectId, ref: 'User'}], default: []})
    organizers: string[];

    @ApiProperty({type: [String], required: false, description: "Пользователи, добавившие в избранное", default: []})
    @Prop({type: [{type: ObjectId, ref: 'User'}], default: []})
    marked: string[];

    @ApiProperty({
        type: String,
        description: "Статус",
        default: EventStatus.WILL_BE,
        required: false
    })
    @Prop({type: String, enum: EventStatus, default: EventStatus.WILL_BE})
    status: EventStatus;
}

export type EventDocument = HydratedDocument<Event>;

export const EventSchema = SchemaFactory.createForClass(Event);