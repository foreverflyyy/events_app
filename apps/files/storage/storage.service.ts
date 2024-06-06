import {Multer} from "multer";
import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {StorageRepository} from "./storage.repository";
import {GrpcInternalException} from "nestjs-grpc-exceptions";

@Injectable()
export class StorageService {
    constructor(
      private readonly configService: ConfigService,
      private readonly storageRepository: StorageRepository
    ) {};

    async getObject(pathToObject: string) {
        try {
            return await this.storageRepository.getObject(pathToObject);
        } catch (err) {
            throw new GrpcInternalException({code: 0, data: "Не удалось обработать/удалить файл."});
        }
    }

    async listObjects() {
        try {
            return await this.storageRepository.listObjects();
        } catch (err) {
            throw new GrpcInternalException({code: 0, data: "Не удалось обработать/удалить файл."});
        }
    }

    async putObject(objectName: string, file: Express.Multer.File) {
        try {
            return await this.storageRepository.putObject(objectName, file);
        } catch (err) {
            throw new GrpcInternalException({code: 0, data: "Не удалось обработать/удалить файл."});
        }
    }

    async copyObject(outPath: string, pathTo: string) {
        try {
            return await this.storageRepository.copyObject(outPath, pathTo);
        } catch (err) {
            throw new GrpcInternalException({code: 0, data: "Не удалось обработать/удалить файл."});
        }
    }

    async deleteObject(path: string) {
        try {
            return await this.storageRepository.deleteObject(path);
        } catch (err) {
            throw new GrpcInternalException({code: 0, data: "Не удалось обработать/удалить файл."});
        }
    }

    async deleteObjects(paths: string[]) {
        try {
            return await this.storageRepository.deleteObjects(paths);
        } catch (err) {
            throw new GrpcInternalException({code: 0, data: "Не удалось обработать/удалить файл."});
        }
    }
}