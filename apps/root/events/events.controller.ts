import {Body, Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import {ApiDefaultResponse, ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {EventsService} from "./events.service";
import {EventResponse, EventsResponse, UpdateEventDto} from "./dto";
import {BaseResponse} from "../common/dto";

@ApiTags("Events")
@Controller("events")
export class EventsController {
    constructor(private eventsService: EventsService) {
    }

    @Get()
    @ApiOperation({summary: "Получение всех мероприятий"})
    @ApiOkResponse({type: EventsResponse})
    async getEvents() {
        const records = await this.eventsService.getEvents();
        return {code: 1, data: records};
    }

    @Get(":id")
    @ApiOperation({summary: "Получение мероприятия по id"})
    @ApiOkResponse({type: EventResponse})
    async getEventById(@Param("id") id: string) {
        const foundRecord = await this.eventsService.getEventById(id);
        return {code: 1, data: foundRecord};
    }

    @Patch(":id")
    @ApiOperation({summary: "Обновление существующего мероприятия"})
    @ApiDefaultResponse({type: EventResponse})
    async updateEvent(@Param("id") id: string, @Body() updateEventDto: UpdateEventDto) {
        const updatedRecord = await this.eventsService.updateEvent(id, updateEventDto);
        return {code: 1, data: updatedRecord};
    }

    @Delete(":id")
    @ApiOperation({summary: "Удаление мероприятия"})
    @ApiDefaultResponse({type: BaseResponse})
    async deleteEvent(@Param("id") id: string) {
        await this.eventsService.deleteEvent(id);
        return {code: 1, data: "Успешное удаление."};
    }

    @Post("eventHandler")
    @ApiDefaultResponse({type: BaseResponse})
    eventHandler() {
        this.eventsService.eventMessage("id");
        return {code: 1, data: "Сообщение по rabbit успешно отправлено."};
    }

    // @Post("changeParticipantsField")
    // @ApiBody({type: ChangeUserFieldDto})
    // @ApiOperation({summary: "Добавление/Удаление поля participants"})
    // @ApiDefaultResponse({type: BaseResponse})
    // async changeParticipantsField(@Body() changeUserFieldDto: ChangeUserFieldDto) {
    //     await this.eventsService.changeParticipantsField(changeUserFieldDto);
    //     return {code: 1, data: "Успешное изменение."};
    // }
    //
    // @Post("changeOrganizersField")
    // @ApiBody({type: ChangeUserFieldDto})
    // @ApiOperation({summary: "Добавление/Удаление поля organizers"})
    // @ApiDefaultResponse({type: BaseResponse})
    // async changeOrganizersField(@Body() changeUserFieldDto: ChangeUserFieldDto) {
    //     await this.eventsService.changeOrganizersField(changeUserFieldDto);
    //     return {code: 1, data: "Успешное изменение."};
    // }
}
