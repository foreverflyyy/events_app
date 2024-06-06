import {ApiProperty, OmitType, PartialType} from "@nestjs/swagger";
import {RoleEntity} from "../../database/entities";
import {IsArray} from "class-validator";

export class RolesResponse {
    @ApiProperty({type: Number, description: "Код ответа", default: 1})
    code: number;

    @ApiProperty({type: [RoleEntity], description: "Полученные данные"})
    data: any;
}

export class RoleResponse {
    @ApiProperty({type: Number, description: "Код ответа", default: 1})
    code: number;

    @ApiProperty({type: RoleEntity, description: "Полученные данные"})
    data: object;
}

export class CreateRoleDto extends OmitType(
    RoleEntity,
    ["id", "availableRoots", "createdAt", "updatedAt"]
) {
    @ApiProperty({type: String, description: "Доступные права", default: []})
    @IsArray()
    availableRoots: string[];
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {

}