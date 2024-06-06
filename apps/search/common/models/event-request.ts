import mongoose, {Types} from "mongoose";
import {ApiProperty} from "@nestjs/swagger";

export enum EventRequestCurrency {
    RUB = "RUB"
}

export enum EventRequestStatus {
    MODERATION = "moderation",
    WILL_BE = "will be",
    RIGHT_NOW = "right now",
    COMPLETED = "completed"
}

export class EventRequestDate {
    @ApiProperty({type: Date, description: "Дата начала", required: true, default: "2024-05-18T14:10:30Z"})
    dateStart: string;

    @ApiProperty({type: Date, description: "Дата окончания", required: true, default: "2024-05-28T18:10:30Z"})
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

export class EventRequestModel implements IEventRequestSchema {
    @ApiProperty({type: String, description: "Id потенциального мероприятия", required: true})
    eventId: string | mongoose.Types.ObjectId | null;

    @ApiProperty({type: String, required: true, default: "Id создателя мероприятия"})
    author: string | mongoose.Types.ObjectId | null;

    @ApiProperty({type: String, description: "Индетификатор записи"})
    _id: Types.ObjectId;

    @ApiProperty({type: String, required: true, default: "Яндекс конференция"})
    name: string;

    @ApiProperty({type: String, required: false, default: "Хорошее мероприятие"})
    description: string;

    @ApiProperty({type: [EventRequestDate], required: true, description: "Даты начал и концов мероприятий"})
    date: EventRequestDate[];

    @ApiProperty({type: String, required: true, description: "Город", default: "Калининград"})
    city: string;

    @ApiProperty({type: String, required: true, description: "Название здания (места)", default: "Moscow city"})
    place: string;

    @ApiProperty({type: String, required: false, description: "Координаты адреса"})
    address: string;

    @ApiProperty({type: 'string', required: true})
    mainImage: string;

    @ApiProperty({type: [String], required: false, description: "Картинки мероприятия."})
    images: string[];

    @ApiProperty({type: String, required: false, default: ""})
    ageLimit: string | mongoose.Types.ObjectId | null;

    @ApiProperty({type: Number, required: false, description: "Цена", default: 0})
    price: number;

    @ApiProperty({type: String, required: false, description: "Курс мероприятия", default: "RUB"})
    currency: EventRequestCurrency;

    @ApiProperty({type: [String], required: false, description: "Теги", default: []})
    tags: string[];

    @ApiProperty({type: [String], required: false, description: "Категории", default: []})
    categories: string[];

    @ApiProperty({type: [String], required: false, description: "Организаторы", default: []})
    organizers: string[];

    @ApiProperty({
        type: String,
        description: "Статус",
        default: EventRequestStatus.WILL_BE,
        required: false
    })
    status: EventRequestStatus;
}