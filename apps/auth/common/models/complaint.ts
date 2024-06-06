import mongoose, {Types} from "mongoose";
import {ApiProperty} from "@nestjs/swagger";
import {Prop} from "@nestjs/mongoose";
import {typesComplaints} from "../../../root/database/schemas";
import {TypeCollection} from "../index";

export interface Complaint {
    _id: mongoose.Types.ObjectId;
    author: string | mongoose.Types.ObjectId | null;
    target: string | mongoose.Types.ObjectId | null;
    type: string | mongoose.Types.ObjectId | null;
    title: string;
    text: string;
    isViewed: boolean;
    createdAt: Date;
}

export class ComplaintModel implements Complaint {
    @ApiProperty({type: String, description: "Индетификатор записи"})
    _id: Types.ObjectId;

    @ApiProperty({type: String, description: "Id автора жалобы", required: true})
    author: string | mongoose.Types.ObjectId | null;

    @ApiProperty({type: String, description: "Id получателя жалобы", required: true})
    target: string | mongoose.Types.ObjectId | null;

    @ApiProperty({
        type: String,
        description: "Тип жалобы (мероприятие, пользователь)",
        required: true,
        enum: typesComplaints,
        default: TypeCollection.Users
    })
    type: string | mongoose.Types.ObjectId | null;

    @ApiProperty({type: String, description: "Заголовок", default: "", required: false})
    @Prop({type: String, default: "", required: false})
    title: string;

    @ApiProperty({type: String, description: "Текст", required: true})
    text: string;

    @ApiProperty({type: Boolean, description: "Флаг просомтра", default: true, required: false})
    isViewed: boolean;

    @ApiProperty({type: Boolean, description: "Флаг доступности", default: true, required: false})
    isActive: boolean;

    @ApiProperty({type: String, description: "Дата создания новости"})
    createdAt: Date;
}