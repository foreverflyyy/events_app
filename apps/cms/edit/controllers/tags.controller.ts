import {BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import {ApiCreatedResponse, ApiDefaultResponse, ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {TagsService} from "../services";
import {Public} from "@app/common/decorators";
import {BaseResponse} from "@app/common/dto";
import {CreateTagDto, TagResponse, TagsResponse, UpdateTagDto} from "../dto";

@ApiTags("Tags")
@Controller("tags")
export class TagsController {
    constructor(private tagsService: TagsService) {
    }

    @Get()
    @Public()
    @ApiOperation({summary: "Получение всех тегов"})
    @ApiOkResponse({type: TagsResponse})
    async getTags() {
        const tags = await this.tagsService.getTags();
        return {code: 1, data: tags};
    }

    @Get(":id")
    @Public()
    @ApiOperation({summary: "Получение тега по id"})
    @ApiOkResponse({type: TagResponse})
    async getTagById(@Param("id") id: string) {
        const foundRecord = await this.tagsService.getTagById(id);
        if (!foundRecord) {
            throw new BadRequestException({code: 0, data: "Тег не был найден."});
        }

        return {code: 1, data: foundRecord};
    }

    @Post()
    @ApiOperation({summary: "Создание нового тега"})
    @ApiCreatedResponse({type: TagResponse})
    async createTag(@Body() createTagDto: CreateTagDto) {
        const createdRecord = await this.tagsService.createTag(createTagDto);
        return {code: 1, data: createdRecord};
    }

    @Patch(":id")
    @ApiOperation({summary: "Обновление существующего тега"})
    @ApiDefaultResponse({type: TagResponse})
    async updateTag(@Param("id") id: string, @Body() updateEventDto: UpdateTagDto) {
        const updatedRecord = await this.tagsService.updateTag(id, updateEventDto);
        return {code: 1, data: updatedRecord};
    }

    @Delete(":id")
    @ApiOperation({summary: "Удаление тега"})
    @ApiDefaultResponse({type: BaseResponse})
    async deleteTag(@Param("id") id: string) {
        await this.tagsService.deleteTag(id);
        return {code: 1, data: "Успешное удаление."};
    }
}
