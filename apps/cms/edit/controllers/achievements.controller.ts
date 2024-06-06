import {Body, Controller, Delete, Get, Param, Patch, Post, UsePipes, ValidationPipe} from '@nestjs/common';
import {ApiCreatedResponse, ApiDefaultResponse, ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {AchievementsService} from "../services";
import {AchievementResponse, AchievementsResponse, CreateAchievementDto, UpdateAchievementDto} from "../dto";
import {BaseResponse} from "../../common/dto";

@ApiTags("Achievements")
@Controller("achievements")
export class AchievementsController {
    constructor(private achievementsService: AchievementsService) {
    }

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

    @Post()
    @ApiOperation({summary: "Создание нового достижения"})
    @ApiCreatedResponse({type: AchievementResponse})
    @UsePipes(new ValidationPipe())
    async createAchievement(@Body() createEventDto: CreateAchievementDto) {
        const newAchievement = await this.achievementsService.createAchievement(createEventDto);
        return {code: 1, data: newAchievement};
    }

    @Patch(":id")
    @ApiOperation({summary: "Обновление существующего достижения"})
    @ApiDefaultResponse({type: AchievementResponse})
    @UsePipes(new ValidationPipe())
    async updateAchievement(@Param("id") id: string, @Body() updateEventDto: UpdateAchievementDto) {
        const updatedRecord = await this.achievementsService.updateAchievement(id, updateEventDto);
        return {code: 1, data: updatedRecord};
    }

    @Delete(":id")
    @ApiOperation({summary: "Удаление достижения"})
    @ApiDefaultResponse({type: BaseResponse})
    @UsePipes(new ValidationPipe())
    async deleteAchievement(@Param("id") id: string) {
        await this.achievementsService.deleteAchievement(id);
        return {code: 1, data: "Успешное удаление!"};
    }
}
