import {StorageService} from "./storage/storage.service";
import {Injectable} from '@nestjs/common';
import {
    AddExtraImagesDto,
    AddMainImageDto,
    DeleteExtraImagesDto,
    DeleteMainImageDto,
    getObjectId,
    getPathExtraImageByParams,
    getPathMainImageByParams,
    parseImageUrl
} from "./common";
import {GrpcCancelledException} from "nestjs-grpc-exceptions";

@Injectable()
export class FilesService {
    constructor(
        private readonly storageService: StorageService
    ) {
    }

    checkIdAndCollectionOnCorrectness(id: string, collection: string) {
        const correctId = getObjectId(id);
        if (!correctId || !collection) {
            throw new GrpcCancelledException({code: 0, data: "Недопустимые параметры"});
        }
    }

    async addMainImage(data: AddMainImageDto) {
        const {id, collection, fileData} = data;
        if (!id || !collection || !fileData) {
            throw new GrpcCancelledException({code: 0, data: "Некорректно переданные параметры."});
        }

        this.checkIdAndCollectionOnCorrectness(id, collection);

        const {
            pathToImage,
            imageFullName,
            fullPathToImage
        } = getPathMainImageByParams(fileData as Express.Multer.File, id, collection);

        await this.storageService.putObject(pathToImage, fileData as Express.Multer.File);

        return {pathToImage, imageFullName, fullPathToImage};
    }

    async deleteMainImage(data: DeleteMainImageDto) {
        const {link: imageUrl} = data;
        if (!imageUrl) {
            throw new GrpcCancelledException({code: 0, data: "Некорректно переданные параметры."});
        }

        const {collectionName, fileName, recordId} = parseImageUrl(imageUrl);
        this.checkIdAndCollectionOnCorrectness(recordId, collectionName);

        await this.storageService.deleteObject(`${collectionName}/${recordId}/${fileName}`);
    }

    async addExtraImages(dtoForAdding: AddExtraImagesDto) {
        const {id, collection, filesData} = dtoForAdding;
        if (!filesData) {
            throw new GrpcCancelledException({code: 0, data: "Некорректно переданные параметры."});
        }

        this.checkIdAndCollectionOnCorrectness(id, collection);

        // Проверка есть ли уже загружен mainImage
        const fullImagesData = [];
        for (const image of filesData) {
            const {
                pathToImage,
                imageFullName,
                fullPathToImage
            } = getPathExtraImageByParams(image as Express.Multer.File, id, collection);

            fullImagesData.push({pathToImage, imageFullName, fullPathToImage});
            await this.storageService.putObject(pathToImage, image as Express.Multer.File);
        }

        return fullImagesData;
    }

    async deleteExtraImages(data: DeleteExtraImagesDto) {
        const {links: imagesUrl} = data;
        if (!imagesUrl || !Array.isArray(imagesUrl)) {
            throw new GrpcCancelledException({code: 0, data: "Некорректно переданные параметры."});
        }

        for (const imageUrl of imagesUrl) {
            const {collectionName, fileName, recordId} = parseImageUrl(imageUrl);

            this.checkIdAndCollectionOnCorrectness(recordId, collectionName);
            await this.storageService.deleteObject(`${collectionName}/${recordId}/${fileName}`);
        }
    }
}
