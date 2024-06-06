import {Body, Controller, Post} from '@nestjs/common';
import {ApiCreatedResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {ComplaintsService} from "../services/complaints.service";
import {BaseResponse} from "../../common/dto";
import {CreateComplaintDto} from "../dto";

@ApiTags("Requests")
@Controller("requests/complaints")
export class ComplaintsController {
    constructor(private helpersService: ComplaintsService) {}

    @Post("sendComplaint")
    @ApiOperation({summary: "Создание новой жалобы"})
    @ApiCreatedResponse({type: BaseResponse})
    async sendComplaint(@Body() dto: CreateComplaintDto) {
        const createdRecord = await this.helpersService.createComplaint(dto);
        return {code: 1, data: createdRecord};
    }
}
