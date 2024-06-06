import {Model} from 'mongoose';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';

import {Achievement} from "../schemas";
import {AbstractWithMainImageRepository} from "./abstract.repository";

@Injectable()
export class AchievementsRepository extends AbstractWithMainImageRepository<Achievement> {
    constructor(@InjectModel(Achievement.name) private achievementModel: Model<Achievement>) {
        super(achievementModel);
    }
}