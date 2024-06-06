import Joi from "joi";
import path from "path";
import {Module} from '@nestjs/common';
import {APP_FILTER} from "@nestjs/core";
import {ConfigModule} from "@nestjs/config";
import {FilesService} from './files.service';
import {FilesController} from './files.controller';
import {StorageModule} from "./storage/storage.module";
import {GrpcServerExceptionFilter} from "nestjs-grpc-exceptions";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                BASE_FILES_URL: Joi.string().required()
            }),
            envFilePath: path.join(__dirname, (process.env.PATH_TO_ENV || ".dev.env"))
        }),
        StorageModule
    ],
    controllers: [FilesController],
    providers: [
        FilesService,
        {
            provide: APP_FILTER,
            useClass: GrpcServerExceptionFilter
        }
    ]
})

export class FilesModule {
}