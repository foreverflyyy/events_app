import {ApiProperty, OmitType, PartialType} from "@nestjs/swagger";
import {News} from "apps/root/database/schemas";
import {IsOptional} from "class-validator";

export class CreateNewsDto extends PartialType(OmitType(
    News,
    ["_id", "countLikes", "active", "createdAt", "comments", "lastChange", "images"]
)){
    @ApiProperty({
        type: 'array',
        items: {type: 'file', items: {type: 'string', format: 'binary'}},
        required: false,
        description: "Картинки новости",
        default: []
    })
    @IsOptional()
    images: Express.Multer.File[];
}

export class NewsRecordsResponse {
    @ApiProperty({type: Number, description: "Код ответа", default: 1})
    code: number;

    @ApiProperty({type: News, description: "Полученные данные"})
    data: object;
}

export class NewsRecordResponse {
    @ApiProperty({type: Number, description: "Код ответа", default: 1})
    code: number;

    @ApiProperty({type: [News], description: "Полученные данные"})
    data: any;
}

export class UpdateNewsDto extends PartialType(OmitType(
    News,
    ["images"]
)) {}