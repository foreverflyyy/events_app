import {Body, Controller, Get, Param, Post, UploadedFiles, UseInterceptors} from '@nestjs/common';
import {ApiBody, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {EventsService} from "../services/events.service";
import {EventRequestResponse, EventRequestsResponse, SendEventRequestDto} from "../dto";
import {BaseResponse} from "../../common/dto";
import {FileFieldsInterceptor} from "@nestjs/platform-express";
import {RequestFiles} from "../../common";

@ApiTags("Requests")
@Controller("requests/events")
export class EventsController {
    constructor(private eventsService: EventsService) {}

    @Get(":id")
    @ApiOperation({summary: "Получение запроса по его id"})
    @ApiOkResponse({type: EventRequestResponse})
    async getAchievementById(@Param("id") id: string) {
        const result = await this.eventsService.getEventRequestById(id);
        return {code: 1, data: result};
    }

    @Get("getByAuthor/:id")
    @ApiOperation({summary: "Получение запросов по id автора"})
    @ApiOkResponse({type: EventRequestsResponse})
    async getRequestByAuthor(@Param("id") id: string) {
        const result = await this.eventsService.getEventRequestsByAuthor({author: id});
        return {code: 1, data: result};
    }

    @Post("sendEventRequest")
    @ApiBody({type: SendEventRequestDto})
    @ApiConsumes("multipart/form-data")
    @ApiCreatedResponse({type: BaseResponse})
    @ApiOperation({summary: "Создать заявку на мероприятие"})
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'mainImage', maxCount: 1},
        {name: 'images', maxCount: 5}
    ]))
    async sendEventRequest(
        @Body() createEventDto: SendEventRequestDto,
        @UploadedFiles() files: RequestFiles
    ) {
        const createdRecord = await this.eventsService.sendEventRequest(createEventDto, files);
        return {code: 1, data: createdRecord};
    }

    // @Post("updateEventRequest")
    // @ApiOperation({summary: "Обновить заявку на мероприятие заявки на мероприятие"})
    // @ApiCreatedResponse({type: BaseResponse})
    // async updateEventRequest(@Body() dto: CreateComplaintDto) {
    //     const createdRecord = await this.eventsService.createComplaint(dto);
    //     return {code: 1, data: createdRecord};
    // }
}
