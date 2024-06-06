import path from "path";
import {Module} from '@nestjs/common';
import {UsersController} from './users.controller';
import {UsersService} from './users.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Event, EventSchema, User, UserSchema} from "apps/root/database/schemas";
import {EventRepository, UsersRepository} from "apps/root/database/repositories";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {EVENT_PACKAGE_NAME, EVENT_SERVICE} from "../common";
import {ConfigModule} from "@nestjs/config";
import Joi from "joi";

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
    controllers: [UsersController],
    providers: [UsersService, UsersRepository, EventRepository],
    exports: [UsersService]
})
export class UsersModule {}
