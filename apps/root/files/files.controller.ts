import {FileFieldsInterceptor} from "@nestjs/platform-express";
import {Body, Controller, Post, UploadedFiles, UseInterceptors, UsePipes, ValidationPipe} from '@nestjs/common';
import {ApiBody, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {FilesService} from "./files.service";
import {
    AddExtraImagesDto,
    AddMainImageDto,
    BaseResponse,
    AddImageResponse,
    AddImagesResponse, DeleteImagesDto,
    DeleteMainImageDto
} from "../common/dto";
import {RequestFiles} from "../common";

@ApiTags("Files")
@Controller("files")
export class FilesController {
    constructor(private filesService: FilesService) {}

    @Post("addMainImage")
    @UsePipes(new ValidationPipe())
    @ApiConsumes("multipart/form-data")
    @ApiBody({ type: AddMainImageDto })
    @ApiOperation({summary: "Добавление основной картинки"})
    @ApiOkResponse({type: AddImageResponse})
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'mainImage', maxCount: 1 }
    ]))
    async addMainImage(
        @Body() dto: AddMainImageDto,
        @UploadedFiles() files: RequestFiles
    ) {
        const response = await this.filesService.addMainImage(dto, files);
        return {code: 1, data: response};
    }

    @Post("deleteMainImage")
    @UsePipes(new ValidationPipe())
    @ApiBody({ type: DeleteMainImageDto })
    @ApiOperation({
        summary: "Удаление картинок",
        description: "На вход принимается массив ссылок на картинки"
    })
    @ApiOkResponse({type: BaseResponse})
    async deleteMainImage(@Body() dto: DeleteMainImageDto) {
        await this.filesService.deleteMainImage(dto);
        return {code: 1, data: "Данные успешно удалены."};
    }

    @Post("addExtraImages")
    @UsePipes(new ValidationPipe())
    @ApiConsumes("multipart/form-data")
    @ApiBody({ type: AddExtraImagesDto })
    @ApiOperation({
        summary: "Добавление дополнительных картинок"
    })
    @ApiCreatedResponse({type: AddImagesResponse})
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'images', maxCount: 5 }
    ]))
    async addExtraImages(
        @Body() dto: AddExtraImagesDto,
        @UploadedFiles() files: RequestFiles
    ) {
        const response = await this.filesService.addExtraImages(dto, files);
        return {code: 1, data: response};
    }

    @Post("deleteExtraImages")
    @UsePipes(new ValidationPipe())
    @ApiBody({ type: DeleteImagesDto })
    @ApiOperation({
        summary: "Удаление картинок",
        description: "На вход принимается массив ссылок на картинки"
    })
    @ApiOkResponse({type: BaseResponse})
    async deleteImages(@Body() deleteImagesDto: DeleteImagesDto) {
        await this.filesService.deleteImages(deleteImagesDto);
        return {code: 1, data: "Данные успешно удалены."};
    }
}
