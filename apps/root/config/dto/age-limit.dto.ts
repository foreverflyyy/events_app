import {ApiProperty} from "@nestjs/swagger";
import {AgeLimit} from "../../database/schemas";

export class AgeLimitResponse {
  @ApiProperty({type: Number, description: "Код ответа", default: 1})
  code: number;

  @ApiProperty({type: AgeLimit, description: "Полученные данные"})
  data: object;
}

export class AgeLimitsResponse {
  @ApiProperty({type: Number, description: "Код ответа", default: 1})
  code: number;

  @ApiProperty({type: [AgeLimit], description: "Полученные данные"})
  data: any;
}