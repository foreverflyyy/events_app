import Joi from "joi";
import path from "path";
import {Module} from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {OperationsService} from './operations.service';
import {OperationsController} from './operations.controller';
import {FILE_PACKAGE_NAME, FILE_SERVICE} from "../common";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {Event, EventSchema} from "../database/schemas";
import {EventRepository} from "../database/repositories";
import {ConfigModule} from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                FILES_URL: Joi.string().required()
            }),
            envFilePath: path.join(__dirname, (process.env.PATH_TO_ENV || ".dev.env"))
        }),
        MongooseModule.forFeature([
            {name: Event.name, schema: EventSchema}
        ]),
        ClientsModule.register([
            {
                name: FILE_SERVICE,
                transport: Transport.GRPC,
                options: {
                    package: FILE_PACKAGE_NAME,
                    protoPath: path.join(__dirname, "proto/file.proto"),
                    url: process.env.FILES_URL
                }
            }
        ])
        // RmqModule.register({name: EVENT_SERVICE})
    ],
    controllers: [OperationsController],
    providers: [
        OperationsService,
        EventRepository
    ]
})
export class OperationsModule {
}