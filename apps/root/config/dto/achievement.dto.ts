import {ApiProperty} from "@nestjs/swagger";
import {Achievement} from "../../database/schemas";

export class AchievementResponse {
  @ApiProperty({type: Number, description: "Код ответа", default: 1})
  code: number;

  @ApiProperty({type: Achievement, description: "Полученные данные"})
  data: object;
}

export class AchievementsResponse {
  @ApiProperty({type: Number, description: "Код ответа", default: 1})
  code: number;

  @ApiProperty({type: [Achievement], description: "Полученные данные"})
  data: any;
}