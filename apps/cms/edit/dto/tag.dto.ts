import {ApiProperty, PartialType} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";
import {TagModel} from "../../common/common";

export class TagResponse {
  @ApiProperty({type: Number, description: "Код ответа", default: 1})
  code: number;

  @ApiProperty({type: TagModel, description: "Полученные данные"})
  data: object;
}

export class TagsResponse {
  @ApiProperty({type: Number, description: "Код ответа", default: 1})
  code: number;

  @ApiProperty({type: [TagModel], description: "Полученные данные"})
  data: any;
}

export class CreateTagDto {
  @ApiProperty({type: String, required: true, description: "Название тега.", default: "С животными"})
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({type: String, required: true, description: "Уникальный код тега", default: "pets"})
  @IsNotEmpty()
  @IsString()
  code: string;
}

export class UpdateTagDto extends PartialType(CreateTagDto) {}