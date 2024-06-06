import {AuthService} from './auth.service';
import {Body, Controller, Post} from '@nestjs/common';
import {ApiDefaultResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {AccessTokenDto, RefreshTokenDto, SignInDto, StaffResponse, TokensResponse} from "./auth.dto";
import {BaseResponse} from "../common/dto";

@ApiTags("Authorization")
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post("signIn")
    @ApiOperation({summary: "Авторизация пользователя"})
    @ApiDefaultResponse({type: TokensResponse})
    async signIn(@Body() dto: SignInDto) {
        const tokens = await this.authService.signIn(dto);
        return {code: 1, data: tokens};
    }

    @Post("logout")
    @ApiOperation({summary: "Выход"})
    @ApiDefaultResponse({type: BaseResponse})
    async logout(@Body() dto: AccessTokenDto) {
        const result = await this.authService.logout(dto);
        return {code: 1, data: result};
    }

    @Post("refresh")
    @ApiOperation({summary: "Обновление токенов пользователя"})
    @ApiDefaultResponse({type: TokensResponse})
    async refreshToken(@Body() dto: RefreshTokenDto) {
        const result = await this.authService.refreshToken(dto);
        return {code: 1, data: result};
    }

    @Post("userByToken")
    @ApiOperation({summary: "Получение пользователя по token"})
    @ApiDefaultResponse({type: StaffResponse})
    async userByToken(@Body() dto: AccessTokenDto) {
        const result = await this.authService.getUserByToken(dto);
        return {code: 1, data: result};
    }
}
