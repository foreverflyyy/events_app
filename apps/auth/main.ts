import path from "path";
import {NestFactory} from '@nestjs/core';
import {AuthModule} from './auth.module';
import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import {AUTH_PACKAGE_NAME} from "./common";

const start = async () => {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthModule, {
        transport: Transport.GRPC,
        options: {
            protoPath: path.join(__dirname, "proto/auth.proto"),
            package: AUTH_PACKAGE_NAME,
            loader: {longs: Number},
            url: process.env.URL
        }
    });

    await app.listen();
};

(async () => {
    await start();
})();