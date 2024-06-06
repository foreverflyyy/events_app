import {IsNotEmpty, IsOptional, IsString} from "class-validator";
import {ApiProperty, OmitType, PartialType, PickType} from "@nestjs/swagger";
import {EventRequestModel, EventRequestDate} from "../../common";

export class SendEventRequestDto extends PickType(
    EventRequestModel,
    ["name", "description", "city", "place", "ageLimit",
        "price", "currency", "tags", "categories", "organizers"]
) {
    @ApiProperty({type: String, required: true, description: "Id автора заявки"})
    @IsNotEmpty()
    author: string;

    @ApiProperty({type: String, required: true, description: "Id адреса"})
    @IsNotEmpty()
    @IsString()
    address: string;

    @ApiProperty({type: [EventRequestDate], required: true, description: "Даты начал и концов мероприятий"})
    @IsNotEmpty()
    date: EventRequestDate[];

    @ApiProperty({
        type: 'file',
        properties: {file: {type: 'string', format: 'binary'}},
        required: true
    })
    mainImage: Express.Multer.File;

    @ApiProperty({
        type: 'array',
        items: {type: 'file', items: {type: 'string', format: 'binary'}},
        required: false,
        description: "Images of events.",
        default: []
    })
    @IsOptional()
    images: Express.Multer.File[];
}

export class UpdateEventRequestDto extends PartialType(OmitType(
    SendEventRequestDto,
    ["mainImage", "images"]
)) {
}

export class EventRequestResponse {
    @ApiProperty({type: Number, description: "Код ответа", default: 1})
    code: number;

    @ApiProperty({type: EventRequestModel, description: "Полученные данные"})
    data: object;
}

export class EventRequestsResponse {
    @ApiProperty({type: Number, description: "Код ответа", default: 1})
    code: number;

    @ApiProperty({type: [EventRequestModel], description: "Полученные данные"})
    data: any;
}