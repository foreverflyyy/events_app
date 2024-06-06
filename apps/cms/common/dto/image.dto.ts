import {ApiProperty} from "@nestjs/swagger";
import {IsArray, IsNotEmpty, IsOptional, IsString} from "class-validator";
import {TypeAction, TypeCollectionWithImages} from "../enums";
import {Multer} from "multer";

export class ChangeUserFieldDto {
    @ApiProperty({type: String, description: "Два значения: add/delete", required: true, enum: Object.values(TypeAction)})
    @IsNotEmpty()
    action: string;

    @ApiProperty({type: String, description: "Id пользователя", required: true})
    @IsNotEmpty()
    id: string;

    @ApiProperty({type: [String], description: "Ids записей для добавления/удаления", required: true, default: []})
    @IsArray()
    values: string[];
}

export class DeleteMainImageDto {
    @ApiProperty({
        type: "string",
        required: true,
        description: "Url to main image.",
        default: ""
    })
    link: string;
}

export class DeleteImagesDto {
    @ApiProperty({
        type: 'array',
        items: {type: "string"},
        required: true,
        description: "Url to images.",
        default: []
    })
    links: string[];
}

export class ChangeImageResponse {
    @ApiProperty({type: Number, description: "Код ответа", default: 1})
    code: number;

    @ApiProperty({type: String, description: "Ссылка на картинку"})
    data: string;
}

export class ChangeImagesResponse {
    @ApiProperty({type: Number, description: "Код ответа", default: 1})
    code: number;

    @ApiProperty({type: [String], description: "Ссылки на картинки"})
    data: string[];
}

export class AddMainImageDto {
    @ApiProperty({type: "string", required: true, description: "Id записи"})
    @IsString()
    id: string;

    @ApiProperty({type: "enum", required: true, description: "Коллекция", enum: Object.values(TypeCollectionWithImages), default: TypeCollectionWithImages.Events})
    @IsString()
    collection: string;

    @ApiProperty({
        type: "file",
        properties: {file: {type: "string", format: "binary"}},
        required: true
    })
    mainImage: Express.Multer.File;
}

export class AddExtraImagesDto {
    @ApiProperty({type: "string", required: true, description: "Id записи"})
    @IsString()
    id: string;

    @ApiProperty({type: "string", required: true, description: "Коллекция", enum: Object.values(TypeCollectionWithImages), default: TypeCollectionWithImages.Events})
    @IsString()
    collection: string;

    @ApiProperty({
        type: 'array',
        items: {type: 'file', items: {type: "string", format: 'binary'}},
        required: true,
        description: "Images of events.",
        default: []
    })
    @IsOptional()
    images: Express.Multer.File[];
}