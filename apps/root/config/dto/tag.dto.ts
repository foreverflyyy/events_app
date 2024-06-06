import {ApiProperty} from "@nestjs/swagger";
import {Tag} from "../../database/schemas";

export class TagResponse {
  @ApiProperty({type: Number, description: "Код ответа", default: 1})
  code: number;

  @ApiProperty({type: Tag, description: "Полученные данные"})
  data: object;
}

export class TagsResponse {
  @ApiProperty({type: Number, description: "Код ответа", default: 1})
  code: number;

  @ApiProperty({type: [Tag], description: "Полученные данные"})
  data: any;
}