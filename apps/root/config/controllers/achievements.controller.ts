import { Controller, Get, Param } from '@nestjs/common';
import {ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {AchievementsService} from "../services";
import {AchievementResponse, AchievementsResponse} from "../dto";

@ApiTags("Achievements")
@Controller("achievements")
export class AchievementsController {
    constructor(private achievementsService: AchievementsService) {}

    @Get()
    @ApiOperation({summary: "Получение всех достижений"})
    @ApiOkResponse({type: AchievementsResponse})
    async getAchievements() {
        const achievements = await this.achievementsService.getAchievements();
        return {code: 1, data: achievements};
    }

    @Get(":id")
    @ApiOperation({summary: "Получение достижения по id"})
    @ApiOkResponse({type: AchievementResponse})
    async getAchievementById(@Param("id") id: string) {
        const foundAchievement = await this.achievementsService.getAchievementById(id);
        return {code: 1, data: foundAchievement};
    }
}
