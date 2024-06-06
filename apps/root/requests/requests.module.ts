import Joi from "joi";
import path from "path";
import {Module} from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {MongooseModule} from "@nestjs/mongoose";
import {EventsService} from './services/events.service';
import {ClientsModule, Transport} from "@nestjs/microservices";
import {EventsController} from './controllers/events.controller';
import {EventRepository, UsersRepository} from "apps/root/database/repositories";
import {Event, EventSchema, News, NewsSchema, User, UserSchema} from "../database/schemas";
import {EVENT_PACKAGE_NAME, EVENT_SERVICE, FILE_PACKAGE_NAME, FILE_SERVICE} from "../common";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                MONGODB_URI: Joi.string().required(),
                FILES_URL: Joi.string().required(),
                AUTH_URL: Joi.string().required()
            }),
            envFilePath: path.join(__dirname, (process.env.PATH_TO_ENV || ".dev.env"))
        }),
        MongooseModule.forFeature([
            {name: User.name, schema: UserSchema},
            {name: Event.name, schema: EventSchema},
            {name: News.name, schema: NewsSchema}
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
            },
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
        EventsService,
        UsersRepository,
        EventRepository
    ]
})
export class RequestsModule {
}