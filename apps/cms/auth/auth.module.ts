import {Module} from '@nestjs/common';

import Joi from "joi";
import path from "path";
import {AuthService} from "./auth.service";
import {ConfigModule} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthController} from "./auth.controller";
import {StaffEntity} from "../database/entities";
import {AUTH_PACKAGE_NAME, AUTH_SERVICE} from "../common";
import {ClientsModule, Transport} from "@nestjs/microservices";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                FILES_URL: Joi.string().required(),
                AUTH_URL: Joi.string().required()
            }),
            envFilePath: path.join(__dirname, (process.env.PATH_TO_ENV || ".dev.env"))
        }),
        TypeOrmModule.forFeature([StaffEntity]),
        ClientsModule.register([
            {
                name: AUTH_SERVICE,
                transport: Transport.GRPC,
                options: {
                    package: AUTH_PACKAGE_NAME,
                    protoPath: path.join(__dirname, "proto/auth.proto"),
                    url: process.env.AUTH_URL
                }
            }
        ])
    ],
    controllers: [AuthController],
    providers: [AuthService]
})

export class AuthModule {
}