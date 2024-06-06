import {
    BadRequestException,
    Controller, Get, Param
} from '@nestjs/common';
import {ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {TagsService} from "../services";
import {TagResponse, TagsResponse} from "../dto";

@ApiTags("Tags")
@Controller("tags")
export class TagsController {
    constructor(private tagsService: TagsService) {}

    @Get()
    @ApiOperation({summary: "Получение всех тегов"})
    @ApiOkResponse({type: TagsResponse})
    async getTags() {
        const tags =  await this.tagsService.getTags();
        return {code: 1, data: tags};
    }

    @Get(":id")
    @ApiOperation({summary: "Получение тега по id"})
    @ApiOkResponse({type: TagResponse})
    async getTagById(@Param("id") id: string) {
        const foundRecord = await this.tagsService.getTagById(id);
        if (!foundRecord) {
            throw new BadRequestException({code: 0, data: "Тег не был найден."});
        }

        return {code: 1, data: foundRecord};
    }
}
