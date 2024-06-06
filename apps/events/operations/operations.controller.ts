import {ApiTags} from "@nestjs/swagger";
import {Controller} from '@nestjs/common';
import {OperationsService} from "./operations.service";
import {
    EventActionType,
    EventAuthorDto,
    EventIdDto,
    EventPeopleDto,
    EventServiceControllerMethods,
    MessageEventRequestResponse,
    MessageEventRequestsResponse,
    UpdateEventDto
} from "../common";
import {Ctx, MessagePattern, Payload, RmqContext} from "@nestjs/microservices";

@ApiTags("Requests")
@Controller("requests")
@EventServiceControllerMethods()
export class OperationsController {
    constructor(private eventsService: OperationsService) {
    }

    baseResponse(data: MessageEventRequestResponse | MessageEventRequestsResponse) {
        return {message: data, statusCode: 200};
    }

    async getEvents() {
        const result = await this.eventsService.getEvents();
        return this.baseResponse({code: 1, data: {records: result as any}});
    }

    async getEventById(data: EventIdDto) {
        const result = await this.eventsService.getEventById(data);
        return this.baseResponse({code: 1, data: result as any});
    }

    async getEventsByAuthor(data: EventAuthorDto) {
        const result = await this.eventsService.getEventsByAuthor(data);
        return this.baseResponse({code: 1, data: {records: result as any}});
    }

    async updateEvent(data: UpdateEventDto) {
        const result = await this.eventsService.updateEvent(data);
        return this.baseResponse({code: 1, data: result as any});
    }

    async deleteEvent(data: EventIdDto) {
        await this.eventsService.deleteEvent(data);
        return this.baseResponse({code: 1, message: "Успешное удаление."});
    }

    async changeParticipantsField(data: EventPeopleDto) {
        if (data.action === EventActionType.ADD) {
            await this.eventsService.addToParticipantsField(data);
        } else {
            await this.eventsService.deleteFromParticipantsField(data);
        }

        return this.baseResponse({code: 1, message: "Успешное изменение."});
    }

    async changeOrganizersField(data: EventPeopleDto) {
        if (data.action === EventActionType.ADD) {
            await this.eventsService.addToOrganizersField(data);
        } else {
            await this.eventsService.deleteFromOrganizersField(data);
        }

        return this.baseResponse({code: 1, message: "Успешное изменение."});
    }

    async changeMarkedField(data: EventPeopleDto) {
        // if (data.action === EventActionType.ADD) {
        //     await this.eventsService.addToOrganizersField(data);
        // } else {
        //     await this.eventsService.deleteFromOrganizersField(data);
        // }

        return this.baseResponse({code: 1, message: "Успешное изменение."});
    }

    @MessagePattern("change_field")
    changeField(@Payload() data: any, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();

        console.log({data, context});
        console.log({originalMsg,channel});
        // const result = await this.eventsService.getEvents();
    }
}
