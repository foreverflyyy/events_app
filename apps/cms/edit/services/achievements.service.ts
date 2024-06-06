import mongoose from "mongoose";
import {Injectable} from '@nestjs/common';

import {CreateAchievementDto, UpdateAchievementDto} from "../dto";

@Injectable()
export class AchievementsService {
    constructor(private readonly achievementRepository: any) {
    }

    getAchievements() {
        return this.achievementRepository.find({});
    }

    getAchievementById(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return this.achievementRepository.findOne({_id: id});
    }

    async createAchievement(createAchievementDto: CreateAchievementDto) {
        return await this.achievementRepository.create(createAchievementDto);
    }

    updateAchievement(id: string, updateAchievementDto: UpdateAchievementDto) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }

        return this.achievementRepository.findOneAndUpdate({_id: id}, updateAchievementDto);
    }

    deleteAchievement(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }

        return this.achievementRepository.deleteOne({_id: id});
    }
}