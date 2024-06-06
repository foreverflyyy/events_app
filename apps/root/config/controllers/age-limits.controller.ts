import {
    BadRequestException,
    Controller, Get, Param
} from '@nestjs/common';
import {ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {AgeLimitsService} from "../services";
import {AgeLimitResponse, AgeLimitsResponse} from "../dto";

@ApiTags('Age limits')
@Controller("ageLimits")
export class AgeLimitsController {
    constructor(private ageLimitsService: AgeLimitsService) {
    }

    @Get()
    @ApiOperation({summary: "Получение всех в.о"})
    @ApiOkResponse({type: AgeLimitsResponse})
    async getAgeLimits() {
        const records = await this.ageLimitsService.getAgeLimits();
        return {code: 1, data: records};
    }

    @Get(":id")
    @ApiOperation({summary: "Получение в.о по id"})
    @ApiOkResponse({type: AgeLimitResponse})
    async getAgeLimitById(@Param("id") id: string) {
        const foundUser = await this.ageLimitsService.getAgeLimitById(id);
        if (!foundUser) {
            throw new BadRequestException({code: 0, data: "Возрастное ограничение не было найдено."});
        }

        return {code: 1, data: foundUser};
    }
}
