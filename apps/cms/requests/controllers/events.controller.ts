import {ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {EventsService} from "../services/events.service";
import {ConfirmOrRejectDto, EventRequestResponse, EventRequestsResponse} from "../dto";
import {BaseResponse} from "../../common/dto";

@ApiTags("EventsRequests")
@Controller("eventsRequests")
export class EventsController {
    constructor(private eventsService: EventsService) {}

    @Get()
    @ApiOperation({summary: "Получение всех запросов на меропрятия"})
    @ApiOkResponse({type: EventRequestsResponse})
    async getEventRequests() {
        const result = await this.eventsService.getEventRequests();
        return {code: 1, data: result};
    }

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
    async getRequestByAuthor(@Param("id") authorId: string) {
        const result = await this.eventsService.getEventRequestsByAuthor(authorId);
        return {code: 1, data: result};
    }

    @Post("confirm")
    @ApiOperation({summary: "Подтвердить запрос"})
    @ApiOkResponse({type: BaseResponse})
    async confirmRequest(@Body() data: ConfirmOrRejectDto) {
        await this.eventsService.confirmRequest(data);
        return {code: 1, data: "Запрос был успешно подтверждён"};
    }

    @Post("reject")
    @ApiOperation({summary: "Отвергнуть запрос"})
    @ApiOkResponse({type: BaseResponse})
    async rejectRequest(@Body() data: ConfirmOrRejectDto) {
        await this.eventsService.rejectRequest(data);
        return {code: 1, data: "Запрос был успешно отвергнут"};
    }
}
