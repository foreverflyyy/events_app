import {
    BadRequestException,
    HttpException,
    Inject,
    Injectable,
    InternalServerErrorException,
    OnModuleInit
} from '@nestjs/common';

import {UpdateEventDto} from "./dto";
import {ClientGrpc, ClientProxy, RpcException} from "@nestjs/microservices";
import {catchError, lastValueFrom, throwError, timeout} from "rxjs";
import {
    EVENT_SERVICE as EVENT_SERVICE_GRPC,
    EVENT_SERVICE_NAME,
    EventActionType,
    EventIdDto,
    EventPeopleDto,
    EventResponse,
    EventServiceClient,
    EventsResponse,
    GrpcErrorPayload,
    TypeAction,
    UpdateEventDto as RequestUpdateEventDto
} from "../common";
import {ChangeUserFieldDto} from "../common/dto";
import {EVENT_SERVICE as EVENT_SERVICE_RABBIT} from "../rmq/services";

@Injectable()
export class EventsService implements OnModuleInit {
    private eventGrpcService: EventServiceClient;

    constructor(
        @Inject(EVENT_SERVICE_GRPC) private eventClient: ClientGrpc,
        @Inject(EVENT_SERVICE_RABBIT) private readonly eventRabbitService: ClientProxy
    ) {
    }

    onModuleInit() {
        this.eventGrpcService =
            this.eventClient.getService<EventServiceClient>(EVENT_SERVICE_NAME);
    }

    getAnswerByRpc = async (func: any, params: any) => {
        const result: EventResponse | EventsResponse = await lastValueFrom(
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

    async getEvents() {
        return await this.getAnswerByRpc(this.eventGrpcService.getEvents, {});
    }

    async getEventById(id: string) {
        return await this.getAnswerByRpc(this.eventGrpcService.getEventById, {id} as EventIdDto);
    }

    async updateEvent(id: string, updateUserDto: UpdateEventDto) {
        return await this.getAnswerByRpc(this.eventGrpcService.updateEvent, {
            id,
            data: updateUserDto
        } as RequestUpdateEventDto);
    }

    async deleteEvent(id: string) {
        return await this.getAnswerByRpc(this.eventGrpcService.deleteEvent, {id} as EventIdDto);
    }

    transformActionType(action: string) {
        switch (action) {
            case TypeAction.ADD:
                return EventActionType.ADD;
            case TypeAction.DELETE:
                return EventActionType.DELETE;
            default:
                throw new InternalServerErrorException({code: 0, data: "Не удалось найти подходящее действие."});
        }
    }

    async changeParticipantsField(data: ChangeUserFieldDto) {
        const {id, action, values} = data;
        const request = {id, action: this.transformActionType(action), people: values} as EventPeopleDto;
        await this.getAnswerByRpc(this.eventGrpcService.changeParticipantsField, request);
    }

    async changeOrganizersField(data: ChangeUserFieldDto) {
        const {id, action, values} = data;
        const request = {id, action: this.transformActionType(action), people: values} as EventPeopleDto;
        return await this.getAnswerByRpc(this.eventGrpcService.changeOrganizersField, request);
    }

    eventMessage(data: string) {
        // await lastValueFrom(
        //     this.eventRabbitService.emit("change_field", {data})
        //         .pipe(catchError(error => throwError(() =>
        //             new HttpException({details: error.details, code: error.code}, 500))))
        // );
        this.eventRabbitService.emit("change_field", {data})
            .pipe(catchError(error => throwError(() =>
                new HttpException({details: error.details, code: error.code}, 500))))
    }
}
