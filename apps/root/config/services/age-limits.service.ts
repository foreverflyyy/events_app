import mongoose from "mongoose";
import { Injectable } from '@nestjs/common';

import {AgeLimitsRepository} from "../../database/repositories";

@Injectable()
export class AgeLimitsService {
    constructor(
        private readonly ageLimitRepository: AgeLimitsRepository
    ) {}

    getAgeLimits() {
        return this.ageLimitRepository.find({});
    }

    getAgeLimitById(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return this.ageLimitRepository.findOne({_id: id});
    }
}
