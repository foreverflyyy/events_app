import {BadRequestException, Injectable} from '@nestjs/common';
import mongoose from "mongoose";

import {CreateNewsDto, UpdateNewsDto} from "./dto";
import {NewsRepository} from "../database/repositories";
import {
    getObjectId,
    getPathExtraImageByParams,
    parseArrayWithIds,
    parseRecordsWithImages
} from "../common/utils";
import {RequestFiles, TypeCollection} from "../common";

@Injectable()
export class NewsService {
    constructor(
        private readonly newsRepository: NewsRepository
    ) {
    }

    async getNews() {
        const foundNews = await this.newsRepository.aggregate();
        return parseRecordsWithImages(foundNews, TypeCollection.News);
    }

    async getNewsById(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        const foundNews = await this.newsRepository.findOne({_id: id});
        if (!foundNews) {
            return null;
        }

        return parseRecordsWithImages([foundNews], TypeCollection.News)[0];
    }

    async createOneNews(createNewsDto: CreateNewsDto, files: RequestFiles) {
        const {eventId, userId} = createNewsDto;
        if ((!eventId || !getObjectId(eventId)) && (!userId || !getObjectId(userId))) {
            throw new BadRequestException({code: 0, data: "Не указаны оба id (userId и eventId)"});
        }
        if (eventId && userId) {
            throw new BadRequestException({code: 0, data: "Указаны оба id (userId и eventId)"});
        }

        const {images = []} = files;

        createNewsDto.userId = getObjectId(createNewsDto.userId);
        createNewsDto.eventId = getObjectId(createNewsDto.eventId);
        createNewsDto.tags = parseArrayWithIds(createNewsDto.tags ?? []);

        const id = new mongoose.Types.ObjectId();
        const extraImageFullNames = [];
        const mainImageFullNames = [];
        for (const image of images) {
            const {pathToImage, imageFullName} = getPathExtraImageByParams(image, String(id), TypeCollection.News);

            mainImageFullNames.push(pathToImage);
            extraImageFullNames.push(imageFullName);
        }

        await this.newsRepository.create({
            _id: id,
            ...createNewsDto,
            images: extraImageFullNames
        });

        const foundNews = await this.newsRepository.aggregate([
            {$match: {_id: id}}
        ]);

        return parseRecordsWithImages(foundNews, TypeCollection.News)[0];
    }

    updateNews(id: string, updateNewsDto: UpdateNewsDto) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }

        updateNewsDto.tags = parseArrayWithIds(updateNewsDto.tags ?? []);

        return this.newsRepository.findOneAndUpdate(
            {_id: id},
            updateNewsDto
        );
    }

    deleteOneNews(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }

        return this.newsRepository.deleteOne({_id: id});
    }
}
