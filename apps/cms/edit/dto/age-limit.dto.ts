import {ApiProperty, PartialType} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";
import {AgeLimitModel} from "../../common/common";

export class AgeLimitResponse {
  @ApiProperty({type: Number, description: "Код ответа", default: 1})
  code: number;

  @ApiProperty({type: AgeLimitModel, description: "Полученные данные"})
  data: object;
}

export class AgeLimitsResponse {
  @ApiProperty({type: Number, description: "Код ответа", default: 1})
  code: number;

  @ApiProperty({type: [AgeLimitModel], description: "Полученные данные"})
  data: any;
}

export class CreateAgeLimitDto {
  @ApiProperty({type: String, required: true, description: "Название в.о.", default: "18+"})
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({type: String, required: true, description: "Уникальный код возраста", default: "eighteen"})
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({type: Number, required: true, description: "С какого возраста.", default: 18})
  @IsNotEmpty()
  @IsString()
  startWith: number;
}

export class UpdateAgeLimitDto extends PartialType(CreateAgeLimitDto) {}