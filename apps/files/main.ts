import path from "path";
import {NestFactory} from '@nestjs/core';
import {FilesModule} from './files.module';
import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import {FILE_PACKAGE_NAME, RpcExceptionFilter} from "./common";

const start = async () => {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(FilesModule, {
        transport: Transport.GRPC,
        options: {
            protoPath: path.join(__dirname, "proto/file.proto"),
            package: FILE_PACKAGE_NAME,
            loader: {longs: Number},
            url: process.env.URL
        }
    });

    app.useGlobalFilters(new RpcExceptionFilter());
    await app.listen();
};

(async () => {
    await start();
})();