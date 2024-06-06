import {ApiProperty, PartialType} from "@nestjs/swagger";
import {IsNotEmpty, IsOptional, IsString} from "class-validator";
import {AchievementModel} from "../../common";

export class AchievementResponse {
  @ApiProperty({type: Number, description: "Код ответа", default: 1})
  code: number;

  @ApiProperty({type: AchievementModel, description: "Полученные данные"})
  data: object;
}

export class AchievementsResponse {
  @ApiProperty({type: Number, description: "Код ответа", default: 1})
  code: number;

  @ApiProperty({type: [AchievementModel], description: "Полученные данные"})
  data: any;
}

export class CreateAchievementDto {
  @ApiProperty({type: String, required: true, description: "Название достижения.", default: "Барин"})
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({type: String, required: true, description: "Уникальный код достижения", default: "barin"})
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({type: String, required: false, description: "Картинка достижения.", default: ""})
  @IsOptional()
  @IsString()
  mainImage?: string;
}

export class UpdateAchievementDto extends PartialType(CreateAchievementDto) {}