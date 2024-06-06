import mongoose from "mongoose";
import { Injectable } from '@nestjs/common';

import {AchievementsRepository} from "../../database/repositories";

@Injectable()
export class AchievementsService {
    constructor(
        private readonly achievementRepository: AchievementsRepository
    ) {}

    getAchievements() {
        return this.achievementRepository.find({});
    }

    getAchievementById(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return this.achievementRepository.findOne({_id: id});
    }
}