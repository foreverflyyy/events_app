import {BadRequestException, HttpException, Inject, Injectable, OnModuleInit} from '@nestjs/common';
import {ClientGrpc, RpcException} from "@nestjs/microservices";
import {catchError, lastValueFrom, throwError, timeout} from "rxjs";
import {
    DeleteMainImageDto,
    FILE_SERVICE,
    FILE_SERVICE_NAME, FileDataResponse,
    FileResponse,
    FilesDataResponse,
    FileServiceClient,
    FilesResponse,
    GrpcErrorPayload, parseImageUrl,
    RequestFiles,
    TypeCollectionWithImages,
    TypeCollectionWithMainImage
} from "../common";
import {AddExtraImagesDto, AddMainImageDto, DeleteImagesDto} from "../common/dto";
import {
    AbstractWithExtraImagesRepository,
    AbstractWithMainImageRepository,
    AchievementsRepository,
    EventRepository,
    NewsRepository,
    RepositoryWithImageFields,
    UsersRepository
} from "../database/repositories";
import {AbstractSchemaWithImages, AbstractSchemaWithMainImage} from "../database/schemas";

@Injectable()
export class FilesService implements OnModuleInit {
    private fileService: FileServiceClient;
    private allRepositories: { [key: string]: RepositoryWithImageFields } = {};

    constructor(
        private readonly newsRepository: NewsRepository,
        private readonly userRepository: UsersRepository,
        private readonly eventRepository: EventRepository,
        private readonly achievementsRepository: AchievementsRepository,
        @Inject(FILE_SERVICE) private fileClient: ClientGrpc
    ) {
    }

    onModuleInit() {
        this.allRepositories[TypeCollectionWithImages.Users] = this.userRepository;
        this.allRepositories[TypeCollectionWithImages.Events] = this.eventRepository;
        this.allRepositories[TypeCollectionWithImages.News] = this.newsRepository;
        this.allRepositories[TypeCollectionWithMainImage.Achievements] = this.achievementsRepository;
        this.fileService =
            this.fileClient.getService<FileServiceClient>(FILE_SERVICE_NAME);
    }

    async getAnswerByRpc(func: any, params: any) {
        const result: FileResponse | FilesResponse = await lastValueFrom(
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

    async addMainImage(dto: AddMainImageDto, files: RequestFiles) {
        const {id, collection} = dto;
        const {mainImage: mainImages} = files;
        if (!id || !collection || !mainImages || !mainImages[0]) {
            throw new BadRequestException({code: 0, data: "Неправильно переданные параметры."});
        }

        const request = {id, collection, fileData: mainImages[0]};
        const mainImageResponse = await this.getAnswerByRpc(this.fileService.addMainImage, request);
        if (!mainImageResponse || typeof mainImageResponse === "string") {
            throw new BadRequestException({code: 0, data: "Не удалось загрузить картинку."});
        }
        const {image: mainImageData} = mainImageResponse as FileDataResponse;

        const needRepository = this.allRepositories[collection] as AbstractWithMainImageRepository<AbstractSchemaWithMainImage>;
        await needRepository.addMainImage(id, mainImageData ? mainImageData.imageFullName : "");

        return mainImageData ? mainImageData.fullPathToImage : "";
    }

    async deleteMainImage(dto: DeleteMainImageDto) {
        const {link} = dto;
        if (!link) {
            throw new BadRequestException({code: 0, data: "Неправильно переданные параметры."});
        }

        await this.getAnswerByRpc(this.fileService.deleteMainImage, {link});

        const {collectionName, recordId} = parseImageUrl(link);
        const needRepository = this.allRepositories[collectionName] as AbstractWithMainImageRepository<AbstractSchemaWithMainImage>;
        await needRepository.deleteMainImage(recordId);
    }

    async addExtraImages(dto: AddExtraImagesDto, files: RequestFiles) {
        const {images} = files;
        const {collection, id} = dto;
        if (!id || !collection || !images || !Array.isArray(images) || !images[0]) {
            throw new BadRequestException({code: 0, data: "Неправильно переданные параметры."});
        }

        const extraImagesResponse = await this.getAnswerByRpc(
            this.fileService.addExtraImages,
            {id: id, collection: collection, filesData: images}
        );
        if (!extraImagesResponse || typeof extraImagesResponse === "string") {
            throw new BadRequestException({code: 0, data: "Не удалось загрузить картинку."});
        }
        const needImages = (extraImagesResponse as FilesDataResponse).images;

        const needRepository = this.allRepositories[collection] as AbstractWithExtraImagesRepository<AbstractSchemaWithImages>;
        await needRepository.addExtraImages(id, needImages.map(image => image.imageFullName));

        return needImages.map(image => image.fullPathToImage);
    }

    async deleteImages(dto: DeleteImagesDto) {
        const {links} = dto;
        if (!links || !Array.isArray(links)) {
            throw new BadRequestException({code: 0, data: "Неправильно переданные параметры."});
        }

        await this.getAnswerByRpc(this.fileService.deleteExtraImages, {links});

        for (const link of links) {
            const {collectionName, recordId, fileName} = parseImageUrl(link);
            const needRepository = this.allRepositories[collectionName] as AbstractWithExtraImagesRepository<AbstractSchemaWithImages>;
            await needRepository.deleteExtraImages(recordId, [fileName]);
        }
    }
}
