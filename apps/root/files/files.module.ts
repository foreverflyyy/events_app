import path from "path";
import {Module} from '@nestjs/common';
import {FilesService} from './files.service';
import {MongooseModule} from "@nestjs/mongoose";
import {FilesController} from './files.controller';
import {FILE_PACKAGE_NAME, FILE_SERVICE} from "../common";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {
    AchievementsRepository,
    EventRepository,
    NewsRepository,
    UsersRepository
} from "apps/root/database/repositories";
import {
    Achievement,
    AchievementSchema,
    Event,
    EventSchema, News,
    NewsSchema,
    User,
    UserSchema
} from "apps/root/database/schemas";
import {ConfigModule} from "@nestjs/config";
import Joi from "joi";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: User.name, schema: UserSchema},
            {name: Event.name, schema: EventSchema},
            {name: Achievement.name, schema: AchievementSchema},
            {name: News.name, schema: NewsSchema}
        ]),
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                FILES_URL: Joi.string().required(),
                AUTH_URL: Joi.string().required()
            }),
            envFilePath: path.join(__dirname, (process.env.PATH_TO_ENV || ".dev.env"))
        }),
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
    controllers: [FilesController],
    providers: [
        FilesService,
        EventRepository,
        UsersRepository,
        NewsRepository,
        AchievementsRepository
    ]
})

export class FilesModule {
}