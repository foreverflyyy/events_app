import Joi from "joi";
import path from "path";
import {Module} from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {EventsService} from "./services/events.service";
import {EVENT_PACKAGE_NAME, EVENT_SERVICE} from "../common";
import {EventsController} from "./controllers/events.controller";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {ComplaintEntity} from "../database/entities";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                EVENTS_URL: Joi.string().required()
            }),
            envFilePath: path.join(__dirname, (process.env.PATH_TO_ENV || ".dev.env"))
        }),
        TypeOrmModule.forFeature([ComplaintEntity]),
        ClientsModule.register([
            {
                name: EVENT_SERVICE,
                transport: Transport.GRPC,
                options: {
                    package: EVENT_PACKAGE_NAME,
                    protoPath: path.join(__dirname, "proto/event.proto"),
                    url: process.env.EVENTS_URL
                }
            }
        ])
    ],
    controllers: [
        EventsController
    ],
    providers: [
        EventsService
    ]
})

export class RequestsModule {
}