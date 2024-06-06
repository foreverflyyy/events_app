import path from "path";
import {Module} from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {RequestsService} from './requests.service';
import {RequestsController} from './requests.controller';
import {FILE_PACKAGE_NAME, FILE_SERVICE} from "../common";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {Event, EventRequest, EventRequestSchema, EventSchema} from "../database/schemas";
import {EventRepository, EventRequestsRepository} from "../database/repositories";
import {ConfigModule} from "@nestjs/config";
import Joi from "joi";

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
            {name: Event.name, schema: EventSchema},
            {name: EventRequest.name, schema: EventRequestSchema}
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
    ],
    controllers: [RequestsController],
    providers: [
        RequestsService,
        EventRepository, EventRequestsRepository
    ]
})
export class RequestsModule {
}