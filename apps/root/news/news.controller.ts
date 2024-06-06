import {
    BadRequestException,
    Body, Controller,
    Delete, Get,
    Param, Patch,
    Post, UploadedFiles, UseInterceptors, UsePipes,
    ValidationPipe
} from '@nestjs/common';
import {
    ApiConsumes,
    ApiCreatedResponse,
    ApiDefaultResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags
} from "@nestjs/swagger";
import {NewsService} from "./news.service";
import {
    CreateNewsDto,
    NewsRecordsResponse,
    NewsRecordResponse,
    UpdateNewsDto
} from "./dto";
import {FileFieldsInterceptor} from "@nestjs/platform-express";
import {RequestFiles} from "../common";
import {BaseResponse} from "../common/dto";

@ApiTags("News")
@Controller("news")
export class NewsController {
    constructor(private newsService: NewsService) {
    }

    @Get()
    @ApiOperation({summary: "Получение всех новостей"})
    @ApiOkResponse({type: NewsRecordsResponse})
    async getNews() {
        const tags = await this.newsService.getNews();
        return {code: 1, data: tags};
    }

    @Get(":id")
    @ApiOperation({summary: "Получение новости по id"})
    @ApiOkResponse({type: NewsRecordResponse})
    async getNewsById(@Param("id") id: string) {
        const foundRecord = await this.newsService.getNewsById(id);
        if (!foundRecord) {
            throw new BadRequestException({code: 0, data: "Новость не была найдена."});
        }

        return {code: 1, data: foundRecord};
    }

    @Post()
    @UsePipes(new ValidationPipe())
    @ApiConsumes('multipart/form-data')
    @ApiOperation({
        summary: "Создание новой новости",
        description: "Необходимо передать либо userId, либо eventId"
    })
    @ApiCreatedResponse({type: NewsRecordsResponse})
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'images', maxCount: 5 },
    ]))
    async createTag(
        @Body() createTagDto: CreateNewsDto,
        @UploadedFiles() files: RequestFiles
    ) {
        const createdRecord = await this.newsService.createOneNews(createTagDto, files);
        return {code: 1, data: createdRecord};
    }

    @Patch(":id")
    @ApiOperation({summary: "Обновление существующей новости"})
    @ApiDefaultResponse({type: NewsRecordsResponse})
    @UsePipes(new ValidationPipe())
    async updateTag(@Param("id") id: string, @Body() updateEventDto: UpdateNewsDto) {
        const updatedRecord = await this.newsService.updateNews(id, updateEventDto);
        return {code: 1, data: updatedRecord};
    }

    @Delete(":id")
    @ApiOperation({summary: "Удаление новости"})
    @ApiDefaultResponse({type: BaseResponse})
    @UsePipes(new ValidationPipe())
    async deleteTag(@Param("id") id: string) {
        await this.newsService.deleteOneNews(id);
        return {code: 1, data: "Успешное удаление."};
    }
}
