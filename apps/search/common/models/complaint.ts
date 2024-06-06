import {ApiProperty} from "@nestjs/swagger";
import {ComplaintTargetCollections} from "../index";

export interface Complaint {
    id: string;
    author: string;
    target: string;
    type: ComplaintTargetCollections;
    title: string;
    text: string;
    isViewed: boolean;
    createdAt: Date;
}

export class ComplaintModel implements Complaint {
    @ApiProperty({type: String, description: "Индетификатор записи"})
    id: string;

    @ApiProperty({type: String, description: "Id автора жалобы", required: true})
    author: string;

    @ApiProperty({type: String, description: "Id получателя жалобы", required: true})
    target: string;

    @ApiProperty({
        type: String,
        description: "Тип жалобы (мероприятие, пользователь)",
        required: true,
        enum: ComplaintTargetCollections,
        default: ComplaintTargetCollections.Users
    })
    type: ComplaintTargetCollections;

    @ApiProperty({type: String, description: "Заголовок", default: "", required: false})
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