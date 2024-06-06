import { Injectable } from '@nestjs/common';
import mongoose from "mongoose";

import {CreateAgeLimitDto, UpdateAgeLimitDto} from "../dto";

@Injectable()
export class AgeLimitsService {
    constructor(
        private readonly ageLimitRepository: any
    ) {}

    async getAgeLimits() {
        return await this.ageLimitRepository.find({});
    }

    getAgeLimitById(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return this.ageLimitRepository.findOne({_id: id});
    }

    async createAgeLimit(createAgeLimitDto: CreateAgeLimitDto) {
        return await this.ageLimitRepository.create(createAgeLimitDto);
    }

    updateAgeLimit(id: string, updateAgeLimitDto: UpdateAgeLimitDto) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }

        return this.ageLimitRepository.findOneAndUpdate({_id: id}, updateAgeLimitDto);
    }

    deleteAgeLimit(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }

        return this.ageLimitRepository.deleteOne({_id: id});
    }
}
