import mongoose, {Types} from "mongoose";
import {ApiProperty} from "@nestjs/swagger";

export interface Category {
    _id: mongoose.Types.ObjectId;
    name: string;
    code: string;
}

export class CategoryModel implements Category {
    @ApiProperty({type: String, description: "Индетификатор записи"})
    _id: Types.ObjectId;

    @ApiProperty({type: String, description: "Название категории", default: "Рекомендованное", required: true})
    name: string;

    @ApiProperty({type: String, description: "Уникальный код категории", default: "recommend", required: true})
    code: string;
}