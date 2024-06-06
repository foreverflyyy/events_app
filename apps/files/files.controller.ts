import {Controller} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {FilesService} from "./files.service";
import {
    AddExtraImagesDto,
    AddMainImageDto,
    DeleteExtraImagesDto,
    DeleteMainImageDto,
    FileServiceControllerMethods,
    MessageFileResponse,
    MessageFilesResponse
} from "./common";

@ApiTags("Files")
@Controller("files")
@FileServiceControllerMethods()
export class FilesController {
    constructor(private changesService: FilesService) {
    }

    baseResponse(data: MessageFileResponse | MessageFilesResponse) {
        return {message: data, statusCode: 200};
    }

    async addMainImage(data: AddMainImageDto) {
        const url = await this.changesService.addMainImage(data);
        return this.baseResponse({code: 1, data: {image: url}});
    }

    async deleteMainImage(data: DeleteMainImageDto) {
        await this.changesService.deleteMainImage(data);
        return this.baseResponse({code: 1, message: "Успешное удаление"});
    }

    async addExtraImages(data: AddExtraImagesDto) {
        const urls = await this.changesService.addExtraImages(data);
        return this.baseResponse({code: 1, data: {images: urls}});
    }

    async deleteExtraImages(data: DeleteExtraImagesDto) {
        await this.changesService.deleteExtraImages(data);
        return this.baseResponse({code: 1, message: "Успешное удаление"});
    }
}
