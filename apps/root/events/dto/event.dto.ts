import {IsOptional} from "class-validator";
import {ApiProperty, PartialType, PickType} from "@nestjs/swagger";
import {EventDateModel, EventModel} from "../../common";

export class EventResponse {
    @ApiProperty({type: Number, description: "Код ответа", default: 1})
    code: number;

    @ApiProperty({type: EventModel, description: "Полученные данные"})
    data: object;
}

export class EventsResponse {
    @ApiProperty({type: Number, description: "Код ответа", default: 1})
    code: number;

    @ApiProperty({type: [EventModel], description: "Полученные данные"})
    data: any;
}

export class UpdateEventDto extends PartialType(PickType(
    EventModel,
    ["name", "description", "city", "place", "address", "ageLimit",
        "price", "currency", "tags", "categories", "organizers"]
)) {
    @ApiProperty({type: [EventDateModel], required: true, description: "Даты начал и концов мероприятий"})
    @IsOptional()
    date: EventDateModel[];
}