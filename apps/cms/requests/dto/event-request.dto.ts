import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";
import {EventRequestModel} from "../../common";

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

export class ConfirmOrRejectDto {
    @ApiProperty({type: String, description: "Id записи", default: "f2784786-1119-4e99-b981-0420630f1d05"})
    @IsNotEmpty()
    id: string;
}