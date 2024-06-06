import {BadRequestException, HttpException, Inject, Injectable, OnModuleInit} from '@nestjs/common';
import {
    EVENT_REQUEST_SERVICE_NAME,
    EVENT_SERVICE,
    EventRequestResponse,
    EventRequestServiceClient,
    EventRequestsResponse,
    GrpcErrorPayload
} from "../../common";
import {ConfirmOrRejectDto} from "../dto";
import {ClientGrpc, RpcException} from "@nestjs/microservices";
import {catchError, lastValueFrom, throwError, timeout} from "rxjs";

@Injectable()
export class EventsService implements OnModuleInit {
    private eventRequestService: EventRequestServiceClient;

    constructor(
        @Inject(EVENT_SERVICE) private eventClient: ClientGrpc
    ) {
    }

    onModuleInit() {
        this.eventRequestService =
            this.eventClient.getService<EventRequestServiceClient>(EVENT_REQUEST_SERVICE_NAME);
    }

    async getAnswerByRpc(func: any, params: any) {
        const result: EventRequestResponse | EventRequestsResponse = await lastValueFrom(
            func(params)
                .pipe(timeout(5000))
                .pipe(catchError(error => throwError(() =>
                    new RpcException({details: error.details, code: error.code} as GrpcErrorPayload))))
        );

        if (!result || !result.message) {
            throw new BadRequestException({code: 0, data: "Не удалось получить ответ по rpc."});
        }
        if (result.statusCode !== 200) {
            throw new HttpException(result.message, result.statusCode);
        }

        const {message, data} = result.message;
        return message ? message : data;
    };

    async getEventRequests() {
        return await this.getAnswerByRpc(this.eventRequestService.getEventRequests, {});
    }

    async getEventRequestsByAuthor(author: string) {
        return await this.getAnswerByRpc(this.eventRequestService.getEventRequestsByAuthor, {author});
    }

    async getEventRequestById(id: string) {
        return await this.getAnswerByRpc(this.eventRequestService.getEventRequestById, {id});
    }

    async confirmRequest(data: ConfirmOrRejectDto) {
        const {id} = data;
        return await this.getAnswerByRpc(this.eventRequestService.confirmEventRequestsByUser, {id});
    }

    async rejectRequest(data: ConfirmOrRejectDto) {
        const {id} = data;
        return await this.getAnswerByRpc(this.eventRequestService.rejectRequestsByUser, {id});
    }
}
