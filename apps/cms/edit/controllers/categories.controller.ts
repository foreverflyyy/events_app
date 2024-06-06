import {BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import {ApiCreatedResponse, ApiDefaultResponse, ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {CategoriesService} from "../services";
import {Public} from "@app/common/decorators";
import {BaseResponse} from "@app/common/dto";
import {CategoriesResponse, CategoryResponse, CreateCategoryDto, UpdateCategoryDto} from "../dto";

@ApiTags("Categories")
@Controller("categories")
export class CategoriesController {
    constructor(private categoriesService: CategoriesService) {}

    @Get()
    @Public()
    @ApiOperation({summary: "Получение всех категорий"})
    @ApiOkResponse({type: CategoriesResponse})
    async getCategories() {
        const records = await this.categoriesService.getCategories();
        return {code: 1, data: records};
    }

    @Get(":id")
    @Public()
    @ApiOperation({summary: "Получение категории по id"})
    @ApiOkResponse({type: CategoryResponse})
    async getCategoryById(@Param("id") id: string) {
        const foundRecord = await this.categoriesService.getCategoryById(id);
        if (!foundRecord) {
            throw new BadRequestException({code: 0, data: "Категория не была найдена."});
        }

        return {code: 1, data: foundRecord};
    }

    @Post()
    @ApiOperation({summary: "Создание нового категории"})
    @ApiCreatedResponse({type: CategoryResponse})
    async createCategory(@Body() createEventDto: CreateCategoryDto) {
        const createdRecord = await this.categoriesService.createCategory(createEventDto);
        return {code: 1, data: createdRecord};
    }

    @Patch(":id")
    @ApiOperation({summary: "Обновление существующей категории"})
    @ApiDefaultResponse({type: CategoryResponse})
    async updateCategory(@Param("id") id: string, @Body() updateEventDto: UpdateCategoryDto) {
        const updatedRecord = await this.categoriesService.updateCategory(id, updateEventDto);
        return {code: 1, data: updatedRecord};
    }

    @Delete(":id")
    @ApiOperation({summary: "Удаление категории"})
    @ApiDefaultResponse({type: BaseResponse})
    async deleteCategory(@Param("id") id: string) {
        await this.categoriesService.deleteCategory(id);
        return {code: 1, data: "Успешное удаление."};
    }
}
