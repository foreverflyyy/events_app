import {
    MessageUserResponse,
    MessageUsersResponse,
    UserServiceControllerMethods,
    UsersIdDto,
    UsersPeopleDto
} from "../common";
import {UsersService} from "./users.service";
import {UpdateUserDto, UserResponse, UsersResponse} from "./dto";
import {ApiDefaultResponse, ApiOperation, ApiParam, ApiTags} from "@nestjs/swagger";
import {BadRequestException, Body, Controller, Get, Param, Patch, UsePipes, ValidationPipe} from '@nestjs/common';

@ApiTags("Users")
@Controller("users")
@UserServiceControllerMethods()
export class UsersController {
    constructor(private usersService: UsersService) {
    }

    baseResponse(data: MessageUserResponse | MessageUsersResponse) {
        return {message: data, statusCode: 200};
    }

    @Get()
    @ApiOperation({summary: "Получение всех пользователей"})
    @ApiDefaultResponse({type: UsersResponse})
    async getUsers() {
        const records = await this.usersService.getUsers();
        return {code: 1, data: records};
    }

    @Get(":id")
    @ApiOperation({summary: "Получение пользователя по id"})
    @ApiParam({name: "id", required: true, description: "User id"})
    @ApiDefaultResponse({type: UserResponse})
    async getUserByIdRestApi(@Param("id") id: string) {
        const foundRecord = await this.usersService.getUserById(id);
        if (!foundRecord) {
            throw new BadRequestException({code: 0, data: "Пользователь не был найден."});
        }

        return {code: 1, data: foundRecord};
    }

    async getUserById(data: UsersIdDto) {
        const result = await this.usersService.getUserById(data.id);
        return this.baseResponse({code: 1, data: result as any});
    }

    @Patch(":id")
    @ApiOperation({summary: "Обновление данных пользователя"})
    @ApiDefaultResponse({type: UserResponse})
    @UsePipes(new ValidationPipe())
    async updateUser(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
        const updatedRecord = await this.usersService.updateUser(id, updateUserDto);
        return {code: 1, data: updatedRecord};
    }

    // @Post("changeFavouritesField")
    // @ApiBody({type: ChangeUserFieldDto})
    // @ApiOperation({summary: "Добавление/Удаление поля favourites"})
    // @ApiDefaultResponse({type: BaseResponse})
    // @UsePipes(new ValidationPipe())
    // async changeFavouritesField(@Body() changeUserFieldDto: ChangeUserFieldDto) {
    //     if (changeUserFieldDto.action === TypeAction.ADD) {
    //         await this.usersService.addToFavouriteField(changeUserFieldDto);
    //     } else {
    //         await this.usersService.deleteFromFavouriteField(changeUserFieldDto);
    //     }
    //     return {code: 1, data: "Успешное изменение."};
    // }

    // @Post("changeEventsField")
    // @ApiBody({type: ChangeUserFieldDto})
    // @ApiOperation({summary: "Добавление/Удаление поля events"})
    // @ApiDefaultResponse({type: BaseResponse})
    // @UsePipes(new ValidationPipe())
    // async changeEventsFieldRestApi(@Body() changeUserFieldDto: ChangeUserFieldDto) {
    //     if (changeUserFieldDto.action === TypeAction.ADD) {
    //         await this.usersService.addToEventsField(changeUserFieldDto);
    //     } else {
    //         await this.usersService.deleteFromEventsField(changeUserFieldDto);
    //     }
    //     return {code: 1, data: "Успешное изменение."};
    // }

    // @Post("changeOwnEventsField")
    // @ApiBody({type: ChangeUserFieldDto})
    // @ApiOperation({summary: "Добавление/Удаление поля ownEvents"})
    // @ApiDefaultResponse({type: BaseResponse})
    // @UsePipes(new ValidationPipe())
    // async changeOwnEventsFieldRestApi(@Body() changeUserFieldDto: ChangeUserFieldDto) {
    //     if (changeUserFieldDto.action === TypeAction.ADD) {
    //         await this.usersService.addToOwnEventsField(changeUserFieldDto);
    //     } else {
    //         await this.usersService.deleteFromOwnEventsField(changeUserFieldDto);
    //     }
    //     return {code: 1, data: "Успешное изменение."};
    // }

    async changeEventsField(data: UsersPeopleDto) {
        await this.usersService.changeEventsField({
            id: data.id,
            action: this.usersService.transformUserActionType(data.action),
            values: data.people
        });

        return this.baseResponse({code: 1, message: "Успешное изменение."});
    }

    async changeOwnEventsField(data: UsersPeopleDto) {
        await this.usersService.changeOwnEventsField({
            id: data.id,
            action: this.usersService.transformUserActionType(data.action),
            values: data.people
        });
        return this.baseResponse({code: 1, message: "Успешное изменение."});
    }
}
