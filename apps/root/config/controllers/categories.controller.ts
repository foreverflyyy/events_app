import {
    BadRequestException,
    Controller, Get, Param
} from '@nestjs/common';
import {ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {CategoriesService} from "../services";
import {CategoriesResponse, CategoryResponse} from "../dto";

@ApiTags("Categories")
@Controller("categories")
export class CategoriesController {
    constructor(private categoriesService: CategoriesService) {}

    @Get()
    @ApiOperation({summary: "Получение всех категорий"})
    @ApiOkResponse({type: CategoriesResponse})
    async getCategories() {
        const records = await this.categoriesService.getCategories();
        return {code: 1, data: records};
    }

    @Get(":id")
    @ApiOperation({summary: "Получение категории по id"})
    @ApiOkResponse({type: CategoryResponse})
    async getCategoryById(@Param("id") id: string) {
        const foundRecord = await this.categoriesService.getCategoryById(id);
        if (!foundRecord) {
            throw new BadRequestException({code: 0, data: "Категория не была найдена."});
        }

        return {code: 1, data: foundRecord};
    }
}
