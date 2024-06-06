import {Body, Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import {RolesService} from "../services";
import {ApiCreatedResponse, ApiDefaultResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {CreateRoleDto, RoleResponse, RolesResponse, UpdateRoleDto} from "../dto";
import {BaseResponse} from "../../common/dto";

@ApiTags("Roles")
@Controller("roles")
export class RolesController {
    constructor(private rolesService: RolesService) {
    }

    @Get()
    @ApiOperation({summary: "Получение ролей"})
    @ApiDefaultResponse({type: RolesResponse})
    async getRoles() {
        const records = await this.rolesService.getRoles();
        return {code: 1, data: records};
    }

    @Post()
    @ApiOperation({summary: "Создание роли"})
    @ApiCreatedResponse({type: RoleResponse})
    async createRole(@Body() dto: CreateRoleDto) {
        const createdRecord = await this.rolesService.createRole(dto);
        return {code: 1, data: createdRecord};
    }

    @Patch(":id")
    @ApiOperation({summary: "Обновление роли"})
    @ApiDefaultResponse({type: RoleResponse})
    async updateRole(@Param("id") id: string, @Body() dto: UpdateRoleDto) {
        const updatedRecord = await this.rolesService.updateRole(id, dto);
        return {code: 1, data: updatedRecord};
    }

    @Delete(":id")
    @ApiOperation({summary: "Удаление роли"})
    @ApiDefaultResponse({type: BaseResponse})
    async deleteRole(@Param("id") id: string) {
        await this.rolesService.deleteRole(id);
        return {code: 1, data: "Успешное удаление."};
    }
}
