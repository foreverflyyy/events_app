import {ApiProperty} from "@nestjs/swagger";

export class BaseResponse {
    @ApiProperty({type: Number, description: "Код ответа", default: 1})
    code: number;

    @ApiProperty({type: String, description: "Полученные данные"})
    data: string;
}