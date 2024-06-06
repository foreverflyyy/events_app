import {Injectable} from '@nestjs/common';
import mongoose from "mongoose";

import {TagsRepository} from "../../database/repositories";

@Injectable()
export class TagsService {
    constructor(private readonly tagsRepository: TagsRepository) {
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
}
