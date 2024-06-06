import {ApiTags} from "@nestjs/swagger";
import {Controller} from '@nestjs/common';
import {RequestsService} from "./requests.service";
import {
    CreateEventRequestDto, EventRequestIdDto, EventRequestServiceControllerMethods, GetEventRequestsByAuthorDto,
    MessageEventRequestResponse,
    MessageEventRequestsResponse,
    UpdateEventRequestDto
} from "../common";

@ApiTags("Requests")
@Controller("requests")
@EventRequestServiceControllerMethods()
export class RequestsController {
    constructor(private eventsService: RequestsService) {
    }

    baseResponse(data: MessageEventRequestResponse | MessageEventRequestsResponse) {
        return {message: data, statusCode: 200};
    }

    async getEventRequests() {
        const records = await this.eventsService.getEventRequests();
        return this.baseResponse({code: 1, data: {records: records as any}});
    }

    async getEventRequestsByAuthor(data: GetEventRequestsByAuthorDto) {
        const result = await this.eventsService.getEventRequestsByAuthor(data);
        return this.baseResponse({code: 1, data: {records: result as any}});
    }

    async getEventRequestById(data: EventRequestIdDto) {
        const result = await this.eventsService.getEventRequestById(data);
        return this.baseResponse({code: 1, data: result as any});
    }

    async sendEventRequest(data: CreateEventRequestDto) {
        const result = await this.eventsService.createNewEventRequest(data);
        return this.baseResponse({code: 1, data: result as any});
    }

    async updateEventRequest(data: UpdateEventRequestDto) {
        const result = await this.eventsService.updateEventRequest(data);
        return this.baseResponse({code: 1, data: result as any});
    }

    async confirmEventRequestsByUser(data: EventRequestIdDto) {
        await this.eventsService.confirmRequest(data);
        return this.baseResponse({code: 1, message: "Запрос был успешно подтверждён"});
    }

    async rejectRequestsByUser(data: EventRequestIdDto) {
        await this.eventsService.rejectRequest(data);
        return this.baseResponse({code: 1, message: "Запрос был успешно отвергнут"});
    }
}
