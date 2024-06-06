import {ApiProperty, OmitType, PartialType} from "@nestjs/swagger";
import {RootEntity} from "../../database/entities";

export class RootsResponse {
    @ApiProperty({type: Number, description: "Код ответа", default: 1})
    code: number;

    @ApiProperty({type: [RootEntity], description: "Полученные данные"})
    data: any;
}

export class RootResponse {
    @ApiProperty({type: Number, description: "Код ответа", default: 1})
    code: number;

    @ApiProperty({type: RootEntity, description: "Полученные данные"})
    data: object;
}

export class CreateRootDto extends OmitType(RootEntity, ["id", "createdAt", "updatedAt"]) {}

export class UpdateRootDto extends PartialType(RootEntity) {}
