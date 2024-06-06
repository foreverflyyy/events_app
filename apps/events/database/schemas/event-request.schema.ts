import {ApiProperty} from "@nestjs/swagger";
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {AbstractSchemaWithMainAndExtraImages} from "./abstract.schema";
import mongoose, {HydratedDocument, Schema as MongooseSchema} from 'mongoose';

const ObjectId = mongoose.Schema.Types.ObjectId;

enum EventCurrency {
    RUB = "RUB"
}

enum EventStatus {
    MODERATION = "moderation",
    WILL_BE = "will be",
    RIGHT_NOW = "right now",
    COMPLETED = "completed"
}

export class EventRequestDate {
    @ApiProperty({type: Date, description: "Дата начала", required: true, default: "2024-05-18T14:10:30Z"})
    @Prop({type: String, required: true})
    dateStart: string;

    @ApiProperty({type: Date, description: "Дата окончания", required: true, default: "2024-05-28T18:10:30Z"})
    @Prop({type: String, required: true})
    dateEnd: string;
}

export interface IEventRequestSchema {
    _id: mongoose.Types.ObjectId;
    eventId: string | mongoose.Types.ObjectId | null;
    author: string | mongoose.Types.ObjectId | null;
    name: string;
    description: string;
    date: EventRequestDate[];
    city: string;
    place: string;
    address: string | mongoose.Types.ObjectId | null;
    mainImage: string;
    images: string[];
    ageLimit: string | mongoose.Types.ObjectId | null;
    price: number;
    currency: string;
    tags: string[];
    categories: string[];
    organizers: string[];
    status: string;
}

@Schema()
export class EventRequest extends AbstractSchemaWithMainAndExtraImages implements IEventRequestSchema {
    @ApiProperty({type: String, description: "Id потенциального мероприятия", required: true})
    @Prop({type: String, required: true})
    eventId: string | mongoose.Types.ObjectId | null;

    @ApiProperty({type: String, required: true, default: "Id создателя мероприятия"})
    @Prop({type: String, required: true})
    author: string | mongoose.Types.ObjectId | null;

    @ApiProperty({type: String, required: true, default: "Яндекс конференция"})
    @Prop({type: String, required: true})
    name: string;

    @ApiProperty({type: String, required: false, default: "Хорошее мероприятие"})
    @Prop({type: String, default: ""})
    description: string;

    @ApiProperty({type: [EventRequestDate], required: true, description: "Даты начал и концов мероприятий"})
    @Prop({type: MongooseSchema.Types.Array, required: true})
    date: EventRequestDate[];

    @ApiProperty({type: String, required: true, description: "Город", default: "Калининград"})
    @Prop({type: String, required: true})
    city: string;

    @ApiProperty({type: String, required: true, description: "Название здания (места)", default: "Moscow city"})
    @Prop({type: String, required: true})
    place: string;

    @ApiProperty({type: String, required: false, description: "Id адреса"})
    @Prop({type: String, required: true})
    address: string | mongoose.Types.ObjectId | null;

    @ApiProperty({type: String, required: false, default: ""})
    @Prop({type: String, required: false, default: null})
    ageLimit: string | mongoose.Types.ObjectId | null;

    @ApiProperty({type: Number, required: false, description: "Цена", default: 0})
    @Prop({type: Number, default: 0})
    price: number;

    @ApiProperty({type: String, required: false, description: "Курс мероприятия", default: "RUB"})
    @Prop({type: String, enum: EventCurrency, default: EventCurrency.RUB})
    currency: string;

    @ApiProperty({type: [String], required: false, description: "Теги", default: []})
    @Prop({type: [{type: ObjectId, ref: 'Tag'}], default: []})
    tags: string[];

    @ApiProperty({type: [String], required: false, description: "Категории", default: []})
    @Prop({type: [{type: ObjectId, ref: 'Category'}], default: []})
    categories: string[];

    @ApiProperty({type: [String], required: false, description: "Организаторы", default: []})
    @Prop({type: [{type: ObjectId, ref: 'User'}], default: []})
    organizers: string[];

    @ApiProperty({
        type: String,
        description: "Статус",
        default: EventStatus.WILL_BE,
        required: false
    })
    @Prop({type: String, enum: EventStatus, default: EventStatus.WILL_BE})
    status: string;
}

export type EventRequestDocument = HydratedDocument<Event>;

export const EventRequestSchema = SchemaFactory.createForClass(EventRequest);