import {Controller} from '@nestjs/common';
import {CmsService} from './cms.service';
import {
    AccessDto,
    AuthCmsServiceControllerMethods, DeleteUserDto,
    MessageResponse, MessageUserResponse,
    RefreshDto, ShortUserData,
    SignInDto,
    TokensData
} from "../common";

@Controller("auth")
@AuthCmsServiceControllerMethods()
export class CmsController {
    constructor(private readonly authService: CmsService) {
    }

    baseResponse(data: MessageResponse | MessageUserResponse) {
        return {message: data, statusCode: 200};
    }

    async signIn(data: SignInDto) {
        const tokens = await this.authService.signIn(data);
        return this.baseResponse({code: 1, data: tokens ?? undefined});
    }

    logout(data: AccessDto) {
        const result = this.authService.logout(data);
        return this.baseResponse({code: 1, message: result});
    }

    async refresh(data: RefreshDto) {
        const result = await this.authService.refreshToken(data);
        return this.baseResponse({code: 1, data: result ?? undefined});
    }

    async checkTokenAndGetUser(data: TokensData) {
        const result = await this.authService.getUserByToken(data);
        return this.baseResponse({code: 1, data: result ?? undefined});
    }

    async addUser(data: ShortUserData) {
        await this.authService.addUser(data);
        return this.baseResponse({code: 1, message: "User created"});
    }

    async deleteUser(data: DeleteUserDto) {
        await this.authService.deleteUser(data);
        return this.baseResponse({code: 1, message: "User deleted"});
    }
}
