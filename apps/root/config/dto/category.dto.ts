import {ApiProperty} from "@nestjs/swagger";
import {Category} from "../../database/schemas";

export class CategoryResponse {
  @ApiProperty({type: Number, description: "Код ответа", default: 1})
  code: number;

  @ApiProperty({type: Category, description: "Полученные данные"})
  data: object;
}

export class CategoriesResponse {
  @ApiProperty({type: Number, description: "Код ответа", default: 1})
  code: number;

  @ApiProperty({type: [Category], description: "Полученные данные"})
  data: any;
}