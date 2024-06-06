import {ApiProperty} from "@nestjs/swagger";
import {ComplaintModel} from "../../common";

export class ComplaintResponse {
  @ApiProperty({type: Number, description: "Код ответа", default: 1})
  code: number;

  @ApiProperty({type: ComplaintModel, description: "Полученные данные"})
  data: object;
}

export class ComplaintsResponse {
  @ApiProperty({type: Number, description: "Код ответа", default: 1})
  code: number;

  @ApiProperty({type: [ComplaintModel], description: "Полученные данные"})
  data: any;
}