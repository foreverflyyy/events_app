import {BadRequestException, HttpException, Inject, Injectable, OnModuleInit} from '@nestjs/common';
import {UsersRepository} from "../../database/repositories";
import {
    CreateEventRequestDto,
    EVENT_REQUEST_SERVICE_NAME,
    EVENT_SERVICE, EventDate,
    EventRequestResponse,
    EventRequestServiceClient,
    FILE_SERVICE,
    FILE_SERVICE_NAME,
    FileServiceClient,
    getObjectId,
    GrpcErrorPayload, parseJson,
    RequestFiles
} from "../../common";
import {ClientGrpc, RpcException} from "@nestjs/microservices";
import {catchError, lastValueFrom, throwError, timeout} from "rxjs";
import mongoose from "mongoose";
import {SendEventRequestDto} from "../dto";
import {EventStatus} from "../../database/schemas";
import {GetEventRequestsByUserDto} from "../../common/types/request";

@Injectable()
export class EventsService implements OnModuleInit {
    private fileService: FileServiceClient;
    private eventRequestService: EventRequestServiceClient;

    constructor(
        @Inject(FILE_SERVICE) private fileClient: ClientGrpc,
        @Inject(EVENT_SERVICE) private eventRequestClient: ClientGrpc,
        private readonly userRepository: UsersRepository
    ) {
    }

    onModuleInit() {
        this.fileService =
            this.fileClient.getService<FileServiceClient>(FILE_SERVICE_NAME);
        this.eventRequestService =
            this.eventRequestClient.getService<EventRequestServiceClient>(EVENT_REQUEST_SERVICE_NAME);
    }

    getEventAnswerByRpc = async (func: any, params: any) => {
        const result: EventRequestResponse = await lastValueFrom(
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

    async getEventRequestsByAuthor(data: GetEventRequestsByUserDto) {
        const {author} = data;
        return await this.getEventAnswerByRpc(this.eventRequestService.getEventRequestsByAuthor, {author});
    }

    async getEventRequestById(id: string) {
        return await this.getEventAnswerByRpc(this.eventRequestService.getEventRequestById, {id});
    }

    async sendEventRequest(sendEventRequestDto: SendEventRequestDto, files: RequestFiles) {
        const {mainImage = [], images = []} = files;
        const needMainImage = mainImage[0] as Express.Multer.File;
        if (!needMainImage) {
            throw new BadRequestException({code: 0, data: "Не указаны необходимые параметры"});
        }

        const date = parseJson(`[${sendEventRequestDto.date}]`) as EventDate[];
        const authorId = getObjectId(sendEventRequestDto.author);
        const addressId = getObjectId(sendEventRequestDto.address);
        if (!authorId || !addressId || !date) {
            throw new BadRequestException({code: 0, data: "Не корректно указанные параметры"});
        }
        const foundUser = await this.userRepository.findOne({_id: authorId});
        if (!foundUser) {
            throw new BadRequestException({code: 0, data: "Такой пользователь не был найден"});
        }

        const requestData: CreateEventRequestDto = {
            ...sendEventRequestDto,
            eventId: String(new mongoose.Types.ObjectId()),
            author: String(authorId),
            address: String(addressId),
            ageLimit: String(sendEventRequestDto.ageLimit ?? ""),
            mainImage: needMainImage,
            images: images,
            status: EventStatus.MODERATION,
            date: date.map(dateObj => ({
                dateStart: String(dateObj.dateStart),
                dateEnd: String(dateObj.dateEnd)
            }))
        };

        return await this.getEventAnswerByRpc(
            this.eventRequestService.sendEventRequest,
            requestData
        );
    }
}