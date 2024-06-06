import {ApiProperty, PartialType} from "@nestjs/swagger";
import {Address} from "../../database/schemas";
import {IsNotEmpty} from "class-validator";

export class AddressResponse {
    @ApiProperty({type: Number, description: "Код ответа", default: 1})
    code: number;

    @ApiProperty({type: Address, description: "Полученные данные"})
    data: object;
}

export class AddressesResponse {
    @ApiProperty({type: Number, description: "Код ответа", default: 1})
    code: number;

    @ApiProperty({type: [Address], description: "Полученные данные"})
    data: any;
}

export class CreateAddressDto {
    @ApiProperty({type: String, description: "Страна", default: "Россия"})
    @IsNotEmpty()
    country: string;

    @ApiProperty({type: String, description: "Город", default: "Калининград"})
    @IsNotEmpty()
    city: string;

    @ApiProperty({type: String, description: "Улица", default: "Чкалова 1а"})
    @IsNotEmpty()
    street: string;

    @ApiProperty({type: String, description: "Полное название (адрес)", default: "Россия, Калининград, Чкалова 1а"})
    @IsNotEmpty()
    fullName: string;

    @ApiProperty({type: String, description: "Долгота", required: true})
    @IsNotEmpty()
    lon: string;

    @ApiProperty({type: String, description: "Широта", required: true})
    @IsNotEmpty()
    lat: string;
}

export class UpdateAddressDto extends PartialType(CreateAddressDto) {
}