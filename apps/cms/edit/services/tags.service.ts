import {Injectable} from '@nestjs/common';
import mongoose from "mongoose";

import {CreateTagDto, UpdateTagDto} from "../dto";

@Injectable()
export class TagsService {
    constructor(private readonly tagsRepository: any) {
    }

    getTags() {
        return this.tagsRepository.find({});
    }

    getTagById(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return this.tagsRepository.findOne({_id: id});
    }

    async createTag(createTagDto: CreateTagDto) {
        return await this.tagsRepository.create(createTagDto);
    }

    updateTag(id: string, updateTagDto: UpdateTagDto) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }

        return this.tagsRepository.findOneAndUpdate({_id: id}, updateTagDto);
    }

    deleteTag(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }

        return this.tagsRepository.deleteOne({_id: id});
    }
}
