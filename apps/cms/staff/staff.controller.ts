import {BaseResponse} from "../common/dto";
import {StaffService} from "./staff.service";
import {BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import {ApiCreatedResponse, ApiDefaultResponse, ApiOperation, ApiParam, ApiTags} from "@nestjs/swagger";
import {AllStaffResponse, CreateUserStaffDto, StaffResponse, UpdateUserStaffDto} from "./user-staff.dto";

@ApiTags("Staff")
@Controller("staff")
export class StaffController {
    constructor(private staffService: StaffService) {}

    @Get()
    @ApiOperation({summary: "Получение всех пользователей"})
    @ApiDefaultResponse({type: AllStaffResponse})
    async getStaff() {
        const records = await this.staffService.getStaff();
        return {code: 1, data: records};
    }

    @Get(":id")
    @ApiOperation({summary: "Получение пользователя по id"})
    @ApiParam({ name: "id", required: true, description: "User id" })
    @ApiDefaultResponse({type: StaffResponse})
    async getUserById(@Param("id") id: string) {
        const foundRecord = await this.staffService.getUserStaffById(id);
        if (!foundRecord) {
            throw new BadRequestException({code: 0, data: "Пользователь не был найден."});
        }

        return {code: 1, data: foundRecord};
    }

    @Post()
    @ApiOperation({summary: "Создание нового пользователя"})
    @ApiCreatedResponse({type: StaffResponse})
    async createUserStaff(@Body() dto: CreateUserStaffDto) {
        const createdRecord = await this.staffService.createUserStaff(dto);
        return {code: 1, data: createdRecord};
    }

    @Patch(":id")
    @ApiOperation({summary: "Обновление данных"})
    @ApiDefaultResponse({type: StaffResponse})
    async updateUser(@Param("id") id: string, @Body() dto: UpdateUserStaffDto) {
        const updatedRecord = await this.staffService.updateUserStaff(id, dto);
        return {code: 1, data: updatedRecord};
    }

    @Delete(":id")
    @ApiOperation({summary: "Удаление пользователя"})
    @ApiDefaultResponse({type: BaseResponse})
    async deleteUserStaff(@Param("id") id: string) {
        await this.staffService.deleteUser(id);
        return {code: 1, data: "Успешное удаление."};
    }
}
