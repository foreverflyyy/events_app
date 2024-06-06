import mongoose, {Types} from "mongoose";
import {ApiProperty} from "@nestjs/swagger";

export interface AgeLimit {
    _id: mongoose.Types.ObjectId;
    name: string;
    code: string;
    startWith: number;
}

export class AgeLimitModel implements AgeLimit {
    @ApiProperty({type: String, description: "Индетификатор записи"})
    _id: Types.ObjectId;

    @ApiProperty({type: String, description: "Название в.о", default: "18+", required: true})
    name: string;

    @ApiProperty({type: String, description: "Уникальный код возраста", default: "eighteen", required: true})
    code: string;

    @ApiProperty({type: String, description: "С какого возраста", default: 18, required: true})
    startWith: number;
}