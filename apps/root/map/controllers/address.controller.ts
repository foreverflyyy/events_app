import {Body, Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import {AddressService} from "../services/address.service";
import {ApiCreatedResponse, ApiDefaultResponse, ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {BaseResponse} from "../../common/dto";
import {AddressesResponse, AddressResponse, CreateAddressDto, UpdateAddressDto} from "../dto/address.dto";

@ApiTags("Address")
@Controller("address")
export class AddressController {
    constructor(private addressService: AddressService) {}

    @Get()
    @ApiOperation({summary: "Получение всех адресов"})
    @ApiOkResponse({type: AddressesResponse})
    async getAddresses() {
        const result = await this.addressService.getAddresses();
        return {code: 1, data: result};
    }

    @Get(":id")
    @ApiOperation({summary: "Получение адреса по id"})
    @ApiOkResponse({type: AddressResponse})
    async getAddressById(@Param("id") id: string) {
        const result = await this.addressService.getAddressById(id);
        return {code: 1, data: result};
    }

    @Post()
    @ApiOperation({summary: "Создание нового адреса"})
    @ApiCreatedResponse({type: AddressResponse})
    async createAddress(@Body() dto: CreateAddressDto) {
        const newAchievement = await this.addressService.createAddress(dto);
        return {code: 1, data: newAchievement};
    }

    @Patch(":id")
    @ApiOperation({summary: "Обновление существующего адреса"})
    @ApiDefaultResponse({type: AddressResponse})
    async updateAddress(@Param("id") id: string, @Body() dto: UpdateAddressDto) {
        const updatedRecord = await this.addressService.updateAddress(id, dto);
        return {code: 1, data: updatedRecord};
    }

    @Delete(":id")
    @ApiOperation({summary: "Удаление адреса"})
    @ApiDefaultResponse({type: BaseResponse})
    async deleteAchievement(@Param("id") id: string) {
        await this.addressService.deleteAddress(id);
        return {code: 1, data: "Успешное удаление!"};
    }
}
