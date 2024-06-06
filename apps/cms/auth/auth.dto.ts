import {ApiProperty} from "@nestjs/swagger";
import {StaffEntity} from "../database/entities";

export class SignInDto {
    @ApiProperty({type: String, description: "Логин", default: "admin"})
    login: string;

    @ApiProperty({type: String, description: "Пароль", default: "admin"})
    password: string;
}

export class AccessTokenDto {
    @ApiProperty({type: String, description: "Токен доступа"})
    accessToken: string;
}

export class RefreshTokenDto {
    @ApiProperty({type: String, description: "Токен обновления"})
    refreshToken: string;
}

export class TokenData {
    @ApiProperty({type: String, description: "Токен доступа", default: ""})
    accessToken: string;

    @ApiProperty({type: String, description: "Токен обновления"})
    refreshToken: string;
}

export class TokensResponse {
    @ApiProperty({type: Number, description: "Код ответа", default: 1})
    code: number;

    @ApiProperty({type: TokenData, description: "Полученные данные"})
    data: TokenData;
}

export class StaffResponse {
    @ApiProperty({type: Number, description: "Код ответа", default: 1})
    code: number;

    @ApiProperty({type: StaffEntity, description: "Полученные данные"})
    data: StaffEntity;
}