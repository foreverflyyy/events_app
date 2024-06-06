import path from "path";
import argon2 from "argon2";
import {readFileSync} from "fs";
import {TokensService} from "../tokens/tokens.service";
import {Injectable} from '@nestjs/common';
import {AccessDto, DeleteUserDto, RefreshDto, ShortUserData, SignInDto, TokensData} from "../common";
import {CmsUserRepository} from "../database/repositories";
import {GrpcUnauthenticatedException} from "nestjs-grpc-exceptions";

enum TokenType {
    ACCESS_TOKEN = "access_token",
    REFRESH_TOKEN = "refresh_token",
}

@Injectable()
export class CmsService {
    PRIVATE_KEY = readFileSync(path.join(__dirname, '../../../configs/private_key.pem'), 'utf8');

    constructor(
        private tokensService: TokensService,
        private readonly cmsUserRepository: CmsUserRepository
    ) {
    }

    getUserForAuth(data: { id?: string, login?: string }) {
        const {id, login} = data;
        if (!id && !login) {
            return null;
        }

        const dataForSearch = id ? {userId: id} : {login};
        return this.cmsUserRepository.findOne(dataForSearch);
    }

    async signIn(dto: SignInDto) {
        const {login, password} = dto;
        if (!login || !password) {
            throw new GrpcUnauthenticatedException({code: 0, data: "Неверно указан логин или пароль."});
        }

        const foundUser = await this.cmsUserRepository.findOne({login});
        if (!foundUser) {
            throw new GrpcUnauthenticatedException({code: 0, data: "Неверно указан логин или пароль."});
        }

        const {password: userPassword, ...otherUserData} = foundUser;
        const isPasswordCorrect = await argon2.verify(userPassword, password);
        if (!isPasswordCorrect) {
            throw new GrpcUnauthenticatedException({code: 0, data: "Неверно указан логин или пароль."});
        }

        return this.tokensService.generateTokens({
            id: foundUser.userId,
            login: otherUserData.login,
            role: otherUserData.role
        });
    }

    logout(dto: AccessDto) {
        const {accessToken} = dto;
        if (!accessToken) {
            throw new GrpcUnauthenticatedException({code: 0, data: "Неверно указанные параметры."});
        }

        const parsedToken = this.tokensService.checkToken(accessToken);
        if (!parsedToken) {
            throw new GrpcUnauthenticatedException({code: 0, data: "Неверно указанные параметры."});
        }

        return "Успешный logout.";
    }

    async refreshToken(dto: RefreshDto) {
        const {refreshToken} = dto;
        if (!refreshToken) {
            throw new GrpcUnauthenticatedException({code: 0, data: "Некорректные параметры."});
        }

        const parsedRefreshToken = this.tokensService.checkToken(refreshToken, TokenType.REFRESH_TOKEN);
        if (!parsedRefreshToken) {
            throw new GrpcUnauthenticatedException({code: 0, data: "Некорректный токен."});
        }

        const foundUser = await this.getUserForAuth(parsedRefreshToken);
        if (!foundUser) {
            throw new GrpcUnauthenticatedException({code: 0, data: "Такой пользователь не был найден."});
        }

        return this.tokensService.generateTokens({
            id: foundUser.userId,
            login: foundUser.login,
            role: foundUser.role
        });
    }

    async getUserByToken(dto: TokensData) {
        const {accessToken, refreshToken} = dto;
        if (!accessToken && !refreshToken) {
            throw new GrpcUnauthenticatedException({code: 0, data: "Некорректные параметры."});
        }

        let parsedAccessToken = null;
        if (accessToken) {
            parsedAccessToken = this.tokensService.checkToken(accessToken);
        } else {
            parsedAccessToken = this.tokensService.checkToken(refreshToken, TokenType.REFRESH_TOKEN);
        }

        if (!parsedAccessToken) {
            throw new GrpcUnauthenticatedException({code: 0, data: "Некорректный токен."});
        }

        const foundUser = await this.cmsUserRepository.findOne({userId: parsedAccessToken.id});
        return foundUser;
    }

    async addUser(data: ShortUserData) {
        await this.cmsUserRepository.create(data);
    }

    async deleteUser(data: DeleteUserDto) {
        let filter = {};
        const {userId, login} = data;
        if (userId) { filter = {userId}; }
        else if (login) { filter = {login}; }
        await this.cmsUserRepository.deleteOne(filter);
    }
}
