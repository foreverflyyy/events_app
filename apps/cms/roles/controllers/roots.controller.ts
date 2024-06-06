import {RootsService} from "../services";
import {CreateRootDto, RootResponse, RootsResponse, UpdateRootDto} from "../dto";
import {Body, Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import {ApiCreatedResponse, ApiDefaultResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {BaseResponse} from "../../common/dto";

@ApiTags("Roots")
@Controller("roots")
export class RootsController {
    constructor(private rootsService: RootsService) {
    }

    @Get()
    @ApiOperation({summary: "Получение всех прав"})
    @ApiDefaultResponse({type: RootsResponse})
    async getRoots() {
        const records = await this.rootsService.getRoots();
        return {code: 1, data: records};
    }

    @Post()
    @ApiOperation({summary: "Создание права"})
    @ApiCreatedResponse({type: RootResponse})
    async createRole(@Body() dto: CreateRootDto) {
        const createdRecord = await this.rootsService.createRoot(dto);
        return {code: 1, data: createdRecord};
    }

    @Patch(":id")
    @ApiOperation({summary: "Обновление права"})
    @ApiDefaultResponse({type: RootResponse})
    async updateRoots(@Param("id") id: string, @Body() dto: UpdateRootDto) {
        const updatedRecord = await this.rootsService.updateRoot(id, dto);
        return {code: 1, data: updatedRecord};
    }

    @Delete("roots/:id")
    @ApiOperation({summary: "Удаление права"})
    @ApiDefaultResponse({type: BaseResponse})
    async deleteUser(@Param("id") id: string) {
        await this.rootsService.deleteRoot(id);
        return {code: 1, data: "Успешное удаление."};
    }
}
