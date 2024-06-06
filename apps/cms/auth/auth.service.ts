import {lastValueFrom, timeout, catchError, throwError} from "rxjs";
import {ClientGrpc, RpcException} from "@nestjs/microservices";
import {AccessTokenDto, RefreshTokenDto, SignInDto} from "./auth.dto";
import {
    BadRequestException,
    Inject,
    Injectable,
    OnModuleInit,
    UnauthorizedException,
    HttpException
} from '@nestjs/common';
import {AUTH_CMS_SERVICE_NAME, AUTH_SERVICE, AuthCmsServiceClient, GrpcErrorPayload, Response} from "../common";

@Injectable()
export class AuthService implements OnModuleInit {
    private authService: AuthCmsServiceClient;

    constructor(
        @Inject(AUTH_SERVICE) private authClient: ClientGrpc
    ) {
    }

    onModuleInit() {
        this.authService =
            this.authClient.getService<AuthCmsServiceClient>(AUTH_CMS_SERVICE_NAME);
    }

    getAnswerByRpc = async (func: any, params: any) => {
        const result: Response = await lastValueFrom(
            func(params)
                .pipe(timeout(5000))
                .pipe(catchError(error => throwError(() =>
                    new RpcException({details: error.details, code: error.code} as GrpcErrorPayload))))
        );

        if (!result || !result.message) {
            throw new BadRequestException({code: 0, data: "Не удалось получить ответ по rpc."});
        }
        if (result.statusCode !== 200) {
            throw new HttpException(result.message, result.statusCode);
        }

        const {message, data} = result.message;
        return message ? message : data;
    };

    async signIn(dto: SignInDto) {
        const {login, password} = dto;
        if (!login || !password) {
            throw new UnauthorizedException({code: 0, data: "Неверно указан логин или пароль."});
        }

        return await this.getAnswerByRpc(this.authService.signIn, {login, password});
    }

    async logout(dto: AccessTokenDto) {
        const {accessToken} = dto;
        if (!accessToken) {
            throw new UnauthorizedException({code: 0, data: "Неверно указанные параметры."});
        }

        return await this.getAnswerByRpc(this.authService.logout, {accessToken});
    }

    async refreshToken(dto: RefreshTokenDto) {
        const {refreshToken} = dto;
        if (!refreshToken) {
            throw new UnauthorizedException({code: 0, data: "Некорректные параметры."});
        }

        return await this.getAnswerByRpc(this.authService.refresh, {refreshToken});
    }

    async getUserByToken(dto: AccessTokenDto) {
        const {accessToken} = dto;
        if (!accessToken) {
            throw new UnauthorizedException({code: 0, data: "Некорректные параметры."});
        }

        return await this.getAnswerByRpc(
            this.authService.checkTokenAndGetUser,
            {accessToken, refreshToken: ""}
        );
    }
}
