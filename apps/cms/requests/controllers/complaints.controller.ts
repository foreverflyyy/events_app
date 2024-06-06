import {Controller, Delete, Get, Param} from '@nestjs/common';
import {ApiDefaultResponse, ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {ComplaintsService} from "../services/complaints.service";
import {ComplaintResponse, ComplaintsResponse} from "../dto";
import {BaseResponse} from "../../common/dto";

@ApiTags("Complaints")
@Controller("complaints")
export class ComplaintsController {
    constructor(private complaintsService: ComplaintsService) {}

    @Get()
    @ApiOperation({summary: "Получение всех жалоб"})
    @ApiOkResponse({type: ComplaintsResponse})
    async getComplaints() {
        const records = await this.complaintsService.getComplaints();
        return {code: 1, data: records};
    }

    @Get(":id")
    @ApiOperation({summary: "Получение жалобы по id"})
    @ApiOkResponse({type: ComplaintResponse})
    async getComplaintById(@Param("id") id: string) {
        const foundRecord = await this.complaintsService.getComplaintById(id);
        return {code: 1, data: foundRecord};
    }

    @Get("noticeViewed/:id")
    @ApiOperation({summary: "Пометить жалобу прочитанной"})
    @ApiOkResponse({type: BaseResponse})
    async noticeViewed(@Param("id") id: string) {
        await this.complaintsService.noticeViewed(id);
        return {code: 1, data: "Запись изменена"};
    }

    @Delete(":id")
    @ApiOperation({summary: "Удаление жалобы"})
    @ApiDefaultResponse({type: BaseResponse})
    async deleteComplaint(@Param("id") id: string) {
        await this.complaintsService.deleteComplaint(id);
        return {code: 1, data: "Успешное удаление."};
    }
}
