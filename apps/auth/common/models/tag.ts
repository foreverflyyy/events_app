import mongoose, {Types} from "mongoose";
import {ApiProperty} from "@nestjs/swagger";

export interface Tag {
    _id: mongoose.Types.ObjectId;
    name: string;
    code: string;
}

export class TagModel {
    @ApiProperty({type: String, description: "Индетификатор записи"})
    _id: Types.ObjectId;

    @ApiProperty({type: String, description: "Название тега", default: "С животными", required: true})
    name: string;

    @ApiProperty({type: String, description: "Уникальный код тега", default: "pets", required: true})
    code: string;
}
