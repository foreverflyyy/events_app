import {BadRequestException, Injectable, OnModuleInit} from '@nestjs/common';

import {CreateComplaintDto} from "../dto";
import {
    AbstractRepository,
    EventRepository,
    NewsRepository,
    UsersRepository
} from "../../database/repositories";
import {getObjectId, ComplaintTargetCollections, TypeCollection} from "../../common";

@Injectable()
export class ComplaintsService implements OnModuleInit {
    private allRepositories: { [key: string]: AbstractRepository<any> } = {};

    constructor(
        private readonly userRepository: UsersRepository,
        private readonly eventRepository: EventRepository,
        private readonly newsRepository: NewsRepository
    ) {
    }

    onModuleInit() {
        this.allRepositories[TypeCollection.Users] = this.userRepository;
        this.allRepositories[TypeCollection.Events] = this.eventRepository;
        this.allRepositories[TypeCollection.News] = this.newsRepository;
    }

    async createComplaint(dto: CreateComplaintDto) {
        const {target, author, type} = dto;
        const availableType = Object.values(ComplaintTargetCollections).some(value => value === type);
        if (!availableType || !getObjectId(author) || !getObjectId(target)) {
            throw new BadRequestException({code: 0, data: "Некорректно переданные параметры."});
        }

        if (target === author) {
            throw new BadRequestException({code: 0, data: "Нельзя отправить жалобу на самомо себя."});
        }

        const foundAuthorUser =
            await this.userRepository.findOne({_id: author});
        if (!foundAuthorUser) {
            throw new BadRequestException({code: 0, data: "Не был найден такой отправитель."});
        }

        const foundRecipient = await this.allRepositories[type].findOne({_id: target});
        if (!foundRecipient) {
            throw new BadRequestException({code: 0, data: "Не был найден такой получатель."});
        }

        // return await this.complaintsRepository.create(dto);
    }
}