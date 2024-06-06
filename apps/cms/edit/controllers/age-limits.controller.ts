import {
    BadRequestException,
    Body,
    Controller,
    Delete, Get,
    Param, Patch,
    Post, UsePipes,
    ValidationPipe
} from '@nestjs/common';
import {ApiCreatedResponse, ApiDefaultResponse, ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {AgeLimitsService} from "../services";
import {Public} from "@app/common/decorators";
import {BaseResponse} from "@app/common/dto";
import {CreateAgeLimitDto, UpdateAgeLimitDto, AgeLimitResponse, AgeLimitsResponse} from "../dto";

@ApiTags("Age limits")
@Controller("ageLimits")
export class AgeLimitsController {
    constructor(private ageLimitsService: AgeLimitsService) {}

    @Get()
    @Public()
    @ApiOperation({summary: "Получение всех в.о"})
    @ApiOkResponse({type: AgeLimitsResponse})
    async getAgeLimits() {
        const records = await this.ageLimitsService.getAgeLimits();
        return {code: 1, data: records};
    }

    @Get(":id")
    @Public()
    @ApiOperation({summary: "Получение в.о по id"})
    @ApiOkResponse({type: AgeLimitResponse})
    async getAgeLimitById(@Param("id") id: string) {
        const foundUser = await this.ageLimitsService.getAgeLimitById(id);
        if (!foundUser) {
            throw new BadRequestException({code: 0, data: "Возрастное ограничение не было найдено."});
        }

        return {code: 1, data: foundUser};
    }

    @Post()
    @ApiOperation({summary: "Создание нового в.о"})
    @ApiCreatedResponse({type: AgeLimitResponse})
    @UsePipes(new ValidationPipe())
    async createAgeLimit(@Body() createEventDto: CreateAgeLimitDto) {
        const createdRecord = await this.ageLimitsService.createAgeLimit(createEventDto);
        return {code: 1, data: createdRecord};
    }

    @Patch(":id")
    @ApiOperation({summary: "Обновление существующего в.о"})
    @ApiDefaultResponse({type: AgeLimitResponse})
    @UsePipes(new ValidationPipe())
    updateAgeLimit(@Param("id") id: string, @Body() updateEventDto: UpdateAgeLimitDto) {
        const updatedRecord = this.ageLimitsService.updateAgeLimit(id, updateEventDto);
        return {code: 1, data: updatedRecord};
    }

    @Delete(":id")
    @ApiOperation({summary: "Удаление в.о"})
    @ApiDefaultResponse({type: BaseResponse})
    @UsePipes(new ValidationPipe())
    async deleteAgeLimit(@Param("id") id: string) {
        await this.ageLimitsService.deleteAgeLimit(id);
        return {code: 1, data: "Успешное удаление"};
    }
}
