import mongoose from "mongoose";
import {
    CreateEventRequestDto,
    EventRequestIdDto,
    File,
    FILE_SERVICE,
    FILE_SERVICE_NAME,
    FileDataResponse,
    FileResponse,
    FilesDataResponse,
    FileServiceClient,
    FilesResponse,
    GetEventRequestsByAuthorDto,
    getFullPathImage,
    getObjectId,
    GrpcErrorPayload,
    parseArrayWithIds,
    parseRecordsWithImages,
    ServerFileData,
    switchIds,
    TypeCollection,
    UpdateEventRequestDto
} from "../common";
import {GrpcCancelledException} from "nestjs-grpc-exceptions";
import {ClientGrpc, RpcException} from "@nestjs/microservices";
import {catchError, lastValueFrom, throwError, timeout} from "rxjs";
import {EventCurrency, EventRequest, EventStatus} from "../database/schemas";
import {EventRepository, EventRequestsRepository} from "../database/repositories";
import {BadRequestException, HttpException, Inject, Injectable, OnModuleInit} from '@nestjs/common';

@Injectable()
export class RequestsService implements OnModuleInit {
    private fileService: FileServiceClient;

    constructor(
        @Inject(FILE_SERVICE) private fileClient: ClientGrpc,
        private readonly eventsRepository: EventRepository,
        private readonly eventRequestsRepository: EventRequestsRepository
    ) {
    }

    onModuleInit() {
        this.fileService =
            this.fileClient.getService<FileServiceClient>(FILE_SERVICE_NAME);
    }

    getFileAnswerByRpc = async (func: any, params: any) => {
        const result: FileResponse | FilesResponse = await lastValueFrom(
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
        const records = await this.eventRequestsRepository.find({});
        if (!records) {
            return records;
        }

        const parsedRecords = parseRecordsWithImages(records, TypeCollection.EventRequests);
        return switchIds<EventRequest>(parsedRecords as EventRequest[]);
    }

    async getEventRequestsByAuthor(data: GetEventRequestsByAuthorDto) {
        const {author} = data;
        const checkedId = getObjectId(author);
        if (!checkedId) {
            throw new GrpcCancelledException({code: 0, data: "Некорректный id автора"});
        }

        const records = await this.eventRequestsRepository.find({author});
        const parsedRecords = parseRecordsWithImages(records, TypeCollection.EventRequests);
        return switchIds<EventRequest>(parsedRecords as EventRequest[]);
    }

    async getEventRequestById(data: EventRequestIdDto) {
        const {id} = data;
        const checkedId = getObjectId(id);
        if (!checkedId) {
            throw new GrpcCancelledException({code: 0, data: "Некорректный id"});
        }

        const record = await this.eventRequestsRepository.findOne({_id: id});
        if (!record) {
            return record;
        }

        const parsedRecord = parseRecordsWithImages([record], TypeCollection.EventRequests)[0];
        return switchIds<EventRequest>([parsedRecord as EventRequest])[0];
    }

    async confirmRequest(data: EventRequestIdDto) {
        const {id} = data;
        if (!getObjectId(id)) {
            throw new GrpcCancelledException({code: 0, data: "Некорректный id"});
        }

        const foundRequest = await this.eventRequestsRepository.findOne({_id: id});
        if (!foundRequest) {
            throw new GrpcCancelledException({code: 0, data: "По такому id не была найдена заявка."});
        }

        const {
            _id,
            eventId,
            date,
            currency,
            status,
            ...otherData
        } = foundRequest;

        if (!eventId) {
            throw new GrpcCancelledException({code: 0, data: "Не указан параметр eventId."});
        }

        await this.eventsRepository.create({
            _id: new mongoose.Types.ObjectId(eventId),
            date: date.map(dateObj => ({
                dateStart: new Date(dateObj.dateStart),
                dateEnd: new Date(dateObj.dateEnd)
            })),
            currency: currency as EventCurrency,
            status: status as EventStatus,
            ...otherData
        });
        await this.eventRequestsRepository.deleteOne({_id});
    }

    async rejectRequest(data: EventRequestIdDto) {
        const {id} = data;
        if (!getObjectId(id)) {
            throw new GrpcCancelledException({code: 0, data: "Некорректный id"});
        }

        const foundRecord = await this.eventRequestsRepository.findOne({_id: id});
        if (!foundRecord) {
            throw new BadRequestException({code: 0, data: "По этому id не найдена запись"});
        }
        if (!foundRecord.eventId) {
            throw new BadRequestException({code: 0, data: "Некорректный параметр eventId в записи."});
        }

        const strEventId = String(foundRecord.eventId);
        if (foundRecord.mainImage) {
            const link = getFullPathImage(strEventId, TypeCollection.Events, foundRecord.mainImage);
            await this.getFileAnswerByRpc(this.fileService.deleteMainImage, {link});
        }

        if (foundRecord.images && foundRecord.images.length) {
            const links = foundRecord.images.map(image =>
                getFullPathImage(strEventId, TypeCollection.Events, image));
            await this.getFileAnswerByRpc(this.fileService.deleteExtraImages, {links});
        }

        await this.eventRequestsRepository.deleteOne({_id: id});
    }

    async createNewEventRequest(data: CreateEventRequestDto) {
        const eventId = getObjectId(data.eventId);
        const ageLimitId = getObjectId(data.ageLimit);
        const authorId = getObjectId(data.author);
        const addressId = getObjectId(data.address);

        const {date, mainImage, images = []} = data;
        if (!authorId || !addressId || !eventId || !date) {
            throw new BadRequestException({code: 0, data: "Не корректно указанные параметры"});
        }

        const organizers = parseArrayWithIds(data.organizers);
        const categories = parseArrayWithIds(data.categories);
        const tags = parseArrayWithIds(data.tags);

        const {
            mainImageData,
            extraImagesData
        } = await this.loadImagesFiles(String(eventId), mainImage, images);

        const createdEventRequest = await this.eventRequestsRepository.create({
            ...data,
            date: date,
            eventId: eventId,
            author: authorId,
            address: addressId,
            ageLimit: ageLimitId,
            mainImage: mainImageData?.imageFullName ?? "",
            images: extraImagesData.map(image => image.imageFullName),
            organizers: organizers,
            categories: categories,
            tags: tags
        });

        return switchIds<EventRequest>([createdEventRequest])[0];
    }

    async loadImagesFiles(id: string, mainImage: File | undefined, images: File[] | undefined) {
        if (!mainImage || !images) {
            throw new GrpcCancelledException({code: 0, data: "Не корректно указанные параметры."});
        }

        const reqMainImage = {id, collection: TypeCollection.Events, fileData: mainImage};
        const mainImageResponse = await this.getFileAnswerByRpc(this.fileService.addMainImage, reqMainImage);

        if (!mainImageResponse || typeof mainImageResponse === "string") {
            throw new BadRequestException({code: 0, data: "Не удалось загрузить картинку."});
        }
        const {image: mainImageData} = mainImageResponse as FileDataResponse;

        let extraImagesData: ServerFileData[] = [];
        if (images.length > 0) {
            const extraImagesResponse = await this.getFileAnswerByRpc(
                this.fileService.addExtraImages,
                {id, collection: TypeCollection.Events, filesData: images}
            );
            if (!extraImagesResponse || typeof extraImagesResponse === "string") {
                throw new BadRequestException({code: 0, data: "Не удалось загрузить картинку."});
            }
            extraImagesData = (extraImagesResponse as FilesDataResponse).images;
        }

        return {mainImageData, extraImagesData};
    }

    async updateEventRequest(data: UpdateEventRequestDto) {
        const {id} = data;
        const foundEventRequest = await this.eventRequestsRepository.findOne({_id: id});
        if (!foundEventRequest) {
            throw new GrpcCancelledException({code: 0, data: "Запись по такому id не была найдена."});
        }

        const updatedRequest = await this.eventRequestsRepository.findOneAndUpdate({_id: id}, data);
        if (!updatedRequest) {
            return updatedRequest;
        }

        return switchIds<EventRequest>([updatedRequest])[0];
    }
}