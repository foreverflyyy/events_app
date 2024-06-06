import mongoose, {Types} from "mongoose";
import {ApiProperty} from "@nestjs/swagger";

export interface Achievement {
    _id: mongoose.Types.ObjectId;
    name: string;
    code: string;
    mainImage: string;
}

export class AchievementModel implements Achievement {
    @ApiProperty({type: String, description: "Индетификатор записи"})
    _id: Types.ObjectId;

    @ApiProperty({type: String, description: "Название достижения", default: "Барин", required: true})
    name: string;

    @ApiProperty({type: String, description: "Уникальный код достижения", default: "barin", required: true})
    code: string;

    @ApiProperty({type: String, description: "Картинка достижения", default: "", required: false})
    mainImage: string;
}