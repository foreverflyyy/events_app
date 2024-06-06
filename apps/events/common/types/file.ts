/* eslint-disable */
import {GrpcMethod, GrpcStreamMethod} from "@nestjs/microservices";
import {Observable} from "rxjs";

const protobufPackage = "file";

export interface FileResponse {
    message: MessageFileResponse | undefined;
    statusCode: number;
    error: string;
}

export interface FilesResponse {
    message: MessageFilesResponse | undefined;
    statusCode: number;
    error: string;
}

export interface MessageFileResponse {
    code: number;
    message?: string | undefined;
    data?: FileDataResponse | undefined;
    error?: string | undefined;
}

export interface MessageFilesResponse {
    code: number;
    message?: string | undefined;
    data?: FilesDataResponse | undefined;
    error?: string | undefined;
}

export interface FileDataResponse {
    image: ServerFileData | undefined;
}

export interface FilesDataResponse {
    images: ServerFileData[];
}

export interface ServerFileData {
    pathToImage: string;
    imageFullName: string;
    fullPathToImage: string;
}

export interface AddMainImageDto {
    id: string;
    collection: string;
    fileData: File | undefined;
}

export interface DeleteMainImageDto {
    link: string;
}

export interface AddExtraImagesDto {
    id: string;
    collection: string;
    filesData: File[];
}

export interface DeleteExtraImagesDto {
    links: string[];
}

export interface File {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Uint8Array;
    size: number;
}

export const FILE_PACKAGE_NAME = "file";

export interface FileServiceClient {
    addMainImage(request: AddMainImageDto): Observable<FileResponse>;

    deleteMainImage(request: DeleteMainImageDto): Observable<FileResponse>;

    addExtraImages(request: AddExtraImagesDto): Observable<FilesResponse>;

    deleteExtraImages(request: DeleteExtraImagesDto): Observable<FilesResponse>;
}

export interface FileServiceController {
    addMainImage(request: AddMainImageDto): Promise<FileResponse> | Observable<FileResponse> | FileResponse;

    deleteMainImage(request: DeleteMainImageDto): Promise<FileResponse> | Observable<FileResponse> | FileResponse;

    addExtraImages(request: AddExtraImagesDto): Promise<FilesResponse> | Observable<FilesResponse> | FilesResponse;

    deleteExtraImages(request: DeleteExtraImagesDto): Promise<FilesResponse> | Observable<FilesResponse> | FilesResponse;
}

export function FileServiceControllerMethods() {
    return function (constructor: Function) {
        const grpcMethods: string[] = ["addMainImage", "deleteMainImage", "addExtraImages", "deleteExtraImages"];
        for (const method of grpcMethods) {
            const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
            GrpcMethod("FileService", method)(constructor.prototype[method], method, descriptor);
        }
        const grpcStreamMethods: string[] = [];
        for (const method of grpcStreamMethods) {
            const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
            GrpcStreamMethod("FileService", method)(constructor.prototype[method], method, descriptor);
        }
    };
}

export const FILE_SERVICE_NAME = "FileService";
