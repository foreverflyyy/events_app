import mongoose, {Types} from "mongoose";
import {ApiProperty} from "@nestjs/swagger";

export enum EventCurrency {
    RUB = "RUB"
}

export enum EventStatus {
    MODERATION = "moderation",
    WILL_BE = "will be",
    RIGHT_NOW = "right now",
    COMPLETED = "completed"
}

export class EventDateModel {
    @ApiProperty({type: Date, description: "Дата начала", required: true, default: "2024-05-18T14:10:30Z"})
    dateStart: string;

    @ApiProperty({type: Date, description: "Дата окончания", required: true, default: "2024-05-28T18:10:30Z"})
    dateEnd: string;
}

export interface Event {
    _id: mongoose.Types.ObjectId;
    author: string | mongoose.Types.ObjectId | null;
    name: string;
    description: string;
    date: EventDateModel[];
    city: string;
    place: string;
    address: string | mongoose.Types.ObjectId | null;
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

export class EventModel implements Event {
    @ApiProperty({type: String, description: "Индетификатор записи"})
    _id: Types.ObjectId;

    @ApiProperty({type: String, required: true, default: "Автор мероприятия"})
    author: string | mongoose.Types.ObjectId | null;

    @ApiProperty({type: String, required: true, default: "Яндекс конференция"})
    name: string;

    @ApiProperty({type: String, required: false, default: "Хорошее мероприятие"})
    description: string;

    @ApiProperty({type: [EventDateModel], required: true, description: "Даты начал и концов мероприятий"})
    date: EventDateModel[];

    @ApiProperty({type: String, required: true, description: "Город", default: "Калининград"})
    city: string;

    @ApiProperty({type: String, required: true, description: "Название здания (места)", default: "Moscow city"})
    place: string;

    @ApiProperty({type: String, required: false, description: "Координаты адреса"})
    address: string | mongoose.Types.ObjectId | null;

    @ApiProperty({type: 'string', required: true})
    mainImage: string;

    @ApiProperty({type: [String], required: false, description: "Картинки мероприятия."})
    images: string[];

    @ApiProperty({type: String, required: false, default: ""})
    ageLimit: string | mongoose.Types.ObjectId | null;

    @ApiProperty({type: Number, required: false, description: "Цена", default: 0})
    price: number;

    @ApiProperty({type: String, required: false, description: "Курс мероприятия", default: "RUB"})
    currency: EventCurrency;

    @ApiProperty({type: [String], required: false, description: "Теги", default: []})
    tags: string[];

    @ApiProperty({type: [String], required: false, description: "Новости", default: []})
    news: string[];

    @ApiProperty({type: [String], required: false, description: "Категории", default: []})
    categories: string[];

    participants: string[];

    @ApiProperty({type: [String], required: false, description: "Организаторы", default: []})
    organizers: string[];

    @ApiProperty({type: [String], required: false, description: "Пользователи, добавившие в избранное", default: []})
    marked: string[];

    @ApiProperty({
        type: String,
        description: "Статус",
        default: EventStatus.WILL_BE,
        required: false
    })
    status: EventStatus;
}