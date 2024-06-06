import Joi from "joi";
import path from "path";
import {Module} from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {EventsService} from './events.service';
import {MongooseModule} from "@nestjs/mongoose";
import {EventsController} from './events.controller';
import {EVENT_PACKAGE_NAME, EVENT_SERVICE as EVENT_SERVICE_GRPC} from "../common";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {UsersRepository} from "apps/root/database/repositories";
import {Event, EventSchema, User, UserSchema} from "apps/root/database/schemas";
import {EVENT_SERVICE as EVENT_SERVICE_RABBIT} from "../rmq/services";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                EVENTS_URL: Joi.string().required()
            }),
            envFilePath: path.join(__dirname, (process.env.PATH_TO_ENV || ".dev.env"))
        }),
        MongooseModule.forFeature([
            {name: User.name, schema: UserSchema},
            {name: Event.name, schema: EventSchema}
        ]),
        ClientsModule.register([
            {
                name: EVENT_SERVICE_GRPC,
                transport: Transport.GRPC,
                options: {
                    package: EVENT_PACKAGE_NAME,
                    protoPath: path.join(__dirname, "proto/event.proto"),
                    url: process.env.EVENTS_URL
                }
            },
            {
                name: EVENT_SERVICE_RABBIT,
                transport: Transport.RMQ,
                options: {
                    urls: [process.env.RABBIT_MQ_URI!],
                    queue: "RABBIT_MQ_EVENT_QUEUE",
                    noAck: true,
                    persistent: true
                }
            }
        ])
    ],
    controllers: [EventsController],
    providers: [EventsService, UsersRepository]
})

export class EventsModule {
}