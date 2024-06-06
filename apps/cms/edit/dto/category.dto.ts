import {ApiProperty, PartialType} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";
import {CategoryModel} from "../../common/common";

export class CategoryResponse {
  @ApiProperty({type: Number, description: "Код ответа", default: 1})
  code: number;

  @ApiProperty({type: CategoryModel, description: "Полученные данные"})
  data: object;
}

export class CategoriesResponse {
  @ApiProperty({type: Number, description: "Код ответа", default: 1})
  code: number;

  @ApiProperty({type: [CategoryModel], description: "Полученные данные"})
  data: any;
}

export class CreateCategoryDto {
  @ApiProperty({type: String, required: true, description: "Название категории.", default: "Рекомендованное"})
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({type: String, required: true, description: "Уникальный код категории", default: "recommend"})
  @IsNotEmpty()
  @IsString()
  code: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}