import {NestFactory} from "@nestjs/core";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {INestApplication, ValidationPipe} from "@nestjs/common";

import {AppModule} from "./app.module";
import {RpcExceptionFilter, USER_PACKAGE_NAME} from "./common";
import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import path from "path";

const initBaseConfiguration = (app: INestApplication) => {
    app.enableCors({
        credentials: true,
        origin: ["http://localhost:3000"],
        allowedHeaders: ["X-Session", "Req-From", "Req-Time",
            "authorization", "accept", "content-type", "content_type",
            "Origin", "X-Requested-With", "Content-Type", "Accept",
            "access_token", "refresh_token", "sentry-trace", "Req-Reg",
            "req-from", "req-client", "req-time"],
        methods: ["POST", "GET", "PUT", "DELETE", "PATCH", "OPTIONS", "PURGE"]
    });
    app.useGlobalPipes(new ValidationPipe({whitelist: true}));
    app.setGlobalPrefix("root/");
};

const initSwagger = (app: INestApplication) => {
    const config = new DocumentBuilder()
        .setTitle('Eventsapp Root Документация')
        .setDescription('Основные методы проекта.')
        .setVersion('1.0.0')
        .addApiKey({
            type: "apiKey",
            name: "X-API-KEY",
            in: "header",
            description: "Enter your API key"
        }, "X-API-KEY")
        .build();
    return SwaggerModule.createDocument(app, config);
};

const start = async () => {
    const app = await NestFactory.create(AppModule);

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.GRPC,
        options: {
            package: USER_PACKAGE_NAME,
            protoPath: path.join(__dirname, "proto/user.proto"),
            url: process.env.USERS_URL
        }
    });
    await app.startAllMicroservices();

    app.useGlobalFilters(new RpcExceptionFilter());

    initBaseConfiguration(app);
    SwaggerModule.setup('root/api/docs', app, initSwagger(app));

    const PORT = process.env.PORT || 5000;
    await app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
};

(async () => {
    await start();
})();