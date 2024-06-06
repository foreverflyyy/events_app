import {ApiProperty, OmitType, PartialType} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";
import {StaffEntity} from "../database/entities";

export class StaffResponse {
    @ApiProperty({type: Number, description: "Код ответа", default: 1})
    code: number;

    @ApiProperty({type: StaffEntity, description: "Полученные данные"})
    data: object;
}

export class AllStaffResponse {
    @ApiProperty({type: Number, description: "Код ответа", default: 1})
    code: number;

    @ApiProperty({type: [StaffEntity], description: "Полученные данные"})
    data: any;
}

export class CreateUserStaffDto extends OmitType(
    StaffEntity,
    ["id", "role", "createdAt", "updatedAt"]
) {
    @ApiProperty({type: String, description: "Роль", default: "509f9be4-18ea-43c4-9189-ea60cc62897b", required: true})
    @IsNotEmpty()
    role: string;
}

export class UpdateUserStaffDto extends PartialType(CreateUserStaffDto) {
}