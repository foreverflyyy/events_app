import {ApiProperty, OmitType} from "@nestjs/swagger";
import {IsNotEmpty, IsString, MinLength} from "class-validator";
import {ComplaintModel, ComplaintTargetCollections} from "../../common";

export class CreateComplaintDto extends OmitType(ComplaintModel, [
    "id", "author", "target", "type", "text", "title", "isViewed", "createdAt"
]) {
    @ApiProperty({type: String, required: true, description: "Id автора жалобы"})
    @IsString()
    @IsNotEmpty()
    author: string;

    @ApiProperty({type: String, required: true, description: "Id получателя жалобы"})
    @IsString()
    @IsNotEmpty()
    target: string;

    @ApiProperty({
        type: String,
        description: "Тип жалобы (мероприятие, пользователь)",
        required: true,
        enum: ComplaintTargetCollections,
        default: ComplaintTargetCollections.Users
    })
    @IsString()
    @IsNotEmpty()
    type: string;

    @ApiProperty({type: String, required: false, description: "Заголовок", default: ""})
    @IsString()
    title: string;

    @ApiProperty({type: String, required: true, description: "Текст", default: "Текст"})
    @IsString()
    @MinLength(4)
    @IsNotEmpty()
    text: string;
}