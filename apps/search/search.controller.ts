import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import {SearchService} from './search.service';
import {EventSearchBody} from "./common";

@Controller()
export class SearchController {
    constructor(private readonly searchService: SearchService) {
    }

    @Get("checkIndex")
    async checkIndex() {
        return await this.searchService.checkIndex();
    }

    @Get("getById/:id")
    async getById(@Param("id") id: string) {
        return await this.searchService.get(id);
    }

    @Get("search")
    async search(@Query("search") search: string) {
        return await this.searchService.search(search);
    }

    @Post("indexEvent")
    async indexEvent(@Body() data: EventSearchBody) {
        return await this.searchService.indexEvent(data);
    }

    @Patch("updateEvent")
    async updateEvent(@Body() data: EventSearchBody) {
        return await this.searchService.update(data);
    }

    @Delete(":id")
    async delete(@Param("id") id: string) {
        return await this.searchService.deleteByDocumentId(id);
    }
}
