import mongoose from "mongoose";
import {
    BadRequestException,
    HttpException,
    Inject,
    Injectable,
    InternalServerErrorException,
    OnModuleInit
} from '@nestjs/common';

import {UpdateUserDto} from "./dto";
import {
    EventActionType,
    EVENT_SERVICE,
    EVENT_SERVICE_NAME, EventPeopleDto, EventResponse,
    EventServiceClient, EventsResponse,
    getObjectId,
    getValuesAndConditions, GrpcErrorPayload,
    parseRecordsWithImages,
    TypeAction,
    TypeCollection,
    UserActionType
} from "../common";
import {ChangeUserFieldDto} from "../common/dto";
import {UsersRepository} from "apps/root/database/repositories";
import {pipelineForFullUser, pipelineForShortUser} from "apps/root/database/pipelines";
import {ClientGrpc, RpcException} from "@nestjs/microservices";
import {catchError, lastValueFrom, throwError, timeout} from "rxjs";

@Injectable()
export class UsersService implements OnModuleInit {
    private eventService: EventServiceClient;

    constructor(
        private readonly userRepository: UsersRepository,
        @Inject(EVENT_SERVICE) private eventClient: ClientGrpc
    ) {
    }

    onModuleInit() {
        this.eventService =
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

    async getUsers() {
        const foundUsers = await this.userRepository.aggregate(pipelineForShortUser);
        return parseRecordsWithImages(foundUsers, TypeCollection.Users);
    }

    async getUserById(id: string) {
        if (!getObjectId(id)) {
            return null;
        }

        const foundUser = await this.userRepository.aggregate([
            {$match: {_id: new mongoose.Types.ObjectId(id)}},
            ...pipelineForFullUser
        ]);
        return parseRecordsWithImages(foundUser, TypeCollection.Users)[0];
    }

    updateUser(id: string, updateUserDto: UpdateUserDto) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }

        return this.userRepository.findOneAndUpdate({_id: id}, updateUserDto);
    }

    transformUserActionType(action: UserActionType) {
        switch (action) {
            case UserActionType.ADD:
                return TypeAction.ADD;
            case UserActionType.DELETE:
                return TypeAction.DELETE;
            default:
                throw new InternalServerErrorException({code: 0, data: "Не удалось найти подходящее действие."});
        }
    }

    transformEventActionType(action: TypeAction) {
        switch (action) {
            case TypeAction.ADD:
                return EventActionType.ADD;
            case TypeAction.DELETE:
                return EventActionType.DELETE;
            default:
                throw new InternalServerErrorException({code: 0, data: "Не удалось найти подходящее действие."});
        }
    }

    async addToFavouriteField(dataFto: ChangeUserFieldDto) {
        const {id, action, values} = dataFto;
        await this.changeFavouritesField(dataFto);

        // await this.eventRepository.updateMany(
        //     {$or: conditionIds},
        //     {$addToSet: {marked: id}}
        // );

        const request = {
            id,
            action: this.transformEventActionType(action as TypeAction),
            people: values
        } as EventPeopleDto;
        await this.getAnswerByRpc(this.eventService.changeMarkedField, request);
    }

    async deleteFromFavouriteField(dataFto: ChangeUserFieldDto) {
        const {id, action, values} = dataFto;
        await this.changeFavouritesField(dataFto);

        // await this.eventRepository.updateMany(
        //     {$or: conditionIds},
        //     {$pull: {marked: id}}
        // );

        const request = {
            id,
            action: this.transformEventActionType(action as TypeAction),
            people: values
        } as EventPeopleDto;
        await this.getAnswerByRpc(this.eventService.changeMarkedField, request);
    }

    async changeFavouritesField(dataFto: ChangeUserFieldDto) {
        const {id, action, values} = dataFto;
        const {valuesIds} = getValuesAndConditions(values);

        switch (action) {
            case TypeAction.ADD:
                await this.userRepository.findOneAndUpdate(
                    {_id: id},
                    {$addToSet: {favourites: valuesIds}}
                );
                break;
            case TypeAction.DELETE:
                await this.userRepository.findOneAndUpdate(
                    {_id: id},
                    {$pullAll: {favourites: valuesIds}}
                );
                break;
            default:
                break;
        }
    }

    async addToEventsField(dataFto: ChangeUserFieldDto) {
        const {id, action, values} = dataFto;
        await this.changeEventsField(dataFto);

        const request = {
            id,
            action: this.transformEventActionType(action as TypeAction),
            people: values
        } as EventPeopleDto;
        await this.getAnswerByRpc(this.eventService.changeParticipantsField, request);
    }

    async deleteFromEventsField(dataFto: ChangeUserFieldDto) {
        const {id, action, values} = dataFto;
        await this.changeEventsField(dataFto);

        const request = {
            id,
            action: this.transformEventActionType(action as TypeAction),
            people: values
        } as EventPeopleDto;
        await this.getAnswerByRpc(this.eventService.changeParticipantsField, request);
    }

    async changeEventsField(dataFto: ChangeUserFieldDto) {
        const {id, action, values} = dataFto;
        const {valuesIds} = getValuesAndConditions(values);

        switch (action) {
            case TypeAction.ADD:
                await this.userRepository.findOneAndUpdate(
                    {_id: id},
                    {$addToSet: {events: valuesIds}}
                );
                break;
            case TypeAction.DELETE:
                await this.userRepository.findOneAndUpdate(
                    {_id: id},
                    {$pullAll: {events: valuesIds}}
                );
                break;
            default:
                break;
        }
    }

    async addToOwnEventsField(dataFto: ChangeUserFieldDto) {
        const {id, action, values} = dataFto;
        await this.changeOwnEventsField(dataFto);

        const request = {
            id,
            action: this.transformEventActionType(action as TypeAction),
            people: values
        } as EventPeopleDto;
        await this.getAnswerByRpc(this.eventService.changeOrganizersField, request);
    }

    async deleteFromOwnEventsField(dataFto: ChangeUserFieldDto) {
        const {id, action, values} = dataFto;
        await this.changeOwnEventsField(dataFto);

        const request = {
            id,
            action: this.transformEventActionType(action as TypeAction),
            people: values
        } as EventPeopleDto;
        await this.getAnswerByRpc(this.eventService.changeOrganizersField, request);
    }

    async changeOwnEventsField(dataFto: ChangeUserFieldDto) {
        const {id, action, values} = dataFto;
        const {valuesIds} = getValuesAndConditions(values);

        switch (action) {
            case TypeAction.ADD:
                await this.userRepository.findOneAndUpdate(
                    {_id: id},
                    {$addToSet: {ownEvents: valuesIds}}
                );
                break;
            case TypeAction.DELETE:
                await this.userRepository.findOneAndUpdate(
                    {_id: id},
                    {$pullAll: {ownEvents: valuesIds}}
                );
                break;
            default:
                break;
        }
    }
}
