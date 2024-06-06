import {
    EventAuthorDto,
    EventIdDto,
    EventPeopleDto,
    FILE_SERVICE,
    FILE_SERVICE_NAME,
    FileResponse,
    FileServiceClient,
    FilesResponse,
    getFullPathImage,
    getObjectId,
    getValuesAndConditions,
    GrpcErrorPayload,
    parseRecordsWithImages,
    switchIds,
    TypeCollection,
    UpdateEventDto
} from "../common";
import mongoose from "mongoose";
import {Event} from "../database/schemas";
import {EventRepository} from "../database/repositories";
import {pipelineForFullEvent} from "../database/pipelines";
import {ClientGrpc, RpcException} from "@nestjs/microservices";
import {Inject, Injectable, OnModuleInit} from '@nestjs/common';
import {catchError, lastValueFrom, throwError, timeout} from "rxjs";
import {GrpcCancelledException, GrpcInternalException} from "nestjs-grpc-exceptions";

@Injectable()
export class OperationsService implements OnModuleInit {
    private fileService: FileServiceClient;

    constructor(
        @Inject(FILE_SERVICE) private fileClient: ClientGrpc,
        private readonly eventRepository: EventRepository
    ) {
    }

    onModuleInit() {
        this.fileService =
            this.fileClient.getService<FileServiceClient>(FILE_SERVICE_NAME);
    }

    getAnswerByRpc = async (func: any, params: any) => {
        const result: FileResponse | FilesResponse = await lastValueFrom(
            func(params)
                .pipe(timeout(5000))
                .pipe(catchError(error => throwError(() =>
                    new RpcException({details: error.details, code: error.code} as GrpcErrorPayload))))
        );

        if (!result || !result.message) {
            throw new GrpcCancelledException({code: 0, data: "Не удалось получить ответ по rpc."});
        }
        if (result.statusCode !== 200) {
            throw new GrpcCancelledException({code: 0, data: result.message, status: result.statusCode});
        }

        const {message, data} = result.message;
        return message ? message : data;
    };

    async getEvents() {
        const records = await this.eventRepository.find({});
        const parsedRecords = parseRecordsWithImages(records, TypeCollection.Events);
        return switchIds<Event>(parsedRecords as Event[]);
    }

    async getEventById(data: EventIdDto) {
        const {id} = data;
        if (!getObjectId(id)) {
            throw new GrpcCancelledException({code: 0, data: "Параметр id указан некорректно."});
        }

        const foundEvent = await this.eventRepository.aggregate([
            {$match: {_id: new mongoose.Types.ObjectId(id)}},
            ...pipelineForFullEvent
        ]);
        const parsedRecord = parseRecordsWithImages(foundEvent, TypeCollection.Events)[0];
        return switchIds<Event>([parsedRecord] as Event[])[0];
    }

    async getEventsByAuthor(data: EventAuthorDto) {
        const {author} = data;
        if (!getObjectId(author)) {
            throw new GrpcCancelledException({code: 0, data: "Параметр author указан некорректно."});
        }

        const foundEvent = await this.eventRepository.aggregate([
            {$match: {author}},
            ...pipelineForFullEvent
        ]);
        const parsedRecords = parseRecordsWithImages(foundEvent, TypeCollection.Events);
        return switchIds<Event>(parsedRecords as Event[]);
    }

    async updateEvent(dataDto: UpdateEventDto) {
        const {id, data = {}} = dataDto;
        if (!getObjectId(id)) {
            throw new GrpcCancelledException({code: 0, data: "Параметр id указан некорректно."});
        }

        const updatedEvent = (await this.eventRepository.findOneAndUpdate({_id: id}, data));
        if (!updatedEvent) {
            throw new GrpcInternalException({code: 0, data: "Не удалось обновить мероприятие."});
        }

        return parseRecordsWithImages([updatedEvent], TypeCollection.Events)[0];
    }

    async deleteEvent(dataDto: EventIdDto) {
        const {id} = dataDto;
        if (!getObjectId(id)) {
            throw new GrpcCancelledException({code: 0, data: "Параметр id указан некорректно."});
        }

        const foundEvent = await this.eventRepository.findOne({_id: id});
        if (!foundEvent) {
            throw new GrpcCancelledException({code: 0, data: "Запись по такому id отсутсвует."});
        }

        if (foundEvent.mainImage !== "") {
            await this.getAnswerByRpc(
                this.fileService.deleteMainImage,
                {link: getFullPathImage(id, TypeCollection.Events, foundEvent.mainImage)}
            );
        }

        if (foundEvent.images.length !== 0) {
            await this.getAnswerByRpc(
                this.fileService.deleteExtraImages,
                {id: String(id), collection: TypeCollection.Events, filesData: foundEvent.images}
            );
        }

        await this.eventRepository.deleteOne({_id: id});
    }

    async addToParticipantsField(dataDto: EventPeopleDto) {
        const {id, people} = dataDto;
        const {valuesIds} = getValuesAndConditions(people);

        await this.eventRepository.findOneAndUpdate(
            {_id: id},
            {$addToSet: {participants: valuesIds}}
        );

        // await this.userRepository.updateMany(
        //     {$or: conditionIds},
        //     {$addToSet: {events: id}}
        // );
    }

    async deleteFromParticipantsField(dataDto: EventPeopleDto) {
        const {id, people} = dataDto;
        const {valuesIds} = getValuesAndConditions(people);

        await this.eventRepository.findOneAndUpdate(
            {_id: id},
            {$pullAll: {participants: valuesIds}}
        );

        // await this.userRepository.updateMany(
        //     {$or: conditionIds},
        //     {$pull: {events: id}}
        // );
    }

    async addToOrganizersField(dataDto: EventPeopleDto) {
        const {id, people} = dataDto;
        const {valuesIds} = getValuesAndConditions(people);

        await this.eventRepository.findOneAndUpdate(
            {_id: id},
            {$addToSet: {organizers: valuesIds}}
        );

        // await this.userRepository.updateMany(
        //     {$or: conditionIds},
        //     {$addToSet: {ownEvents: id}}
        // );
    }

    async deleteFromOrganizersField(dataDto: EventPeopleDto) {
        const {id, people} = dataDto;
        const {valuesIds} = getValuesAndConditions(people);

        await this.eventRepository.findOneAndUpdate(
            {_id: id},
            {$pullAll: {organizers: valuesIds}}
        );

        // await this.userRepository.updateMany(
        //     {$or: conditionIds},
        //     {$pull: {ownEvents: id}}
        // );
    }

    // async sendLetter(request: any, authentication: string) {
    //   // const session = await this.userRepository.startTransaction();
    //   try {
    //     await lastValueFrom(
    //       this.rabbitLetterService.emit('send_letter', {
    //         request,
    //         Authentication: authentication
    //       })
    //     )
    //   } catch (err: any) {
    //     // await session.abortTransaction();
    //     throw err;
    //   }
    // }
}