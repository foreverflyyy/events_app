import {CmsModule} from './cms.module';
import {NestFactory} from '@nestjs/core';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {INestApplication, ValidationPipe} from "@nestjs/common";
import {RpcExceptionFilter} from "./common";

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
    app.useGlobalFilters(new RpcExceptionFilter());
    app.setGlobalPrefix("cms/");
};

const initSwagger = (app: INestApplication) => {
    const config = new DocumentBuilder()
        .setTitle('Eventsapp CMS Документация')
        .setDescription('Основные методы проекты.')
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
    const app = await NestFactory.create(CmsModule);

    initBaseConfiguration(app);
    SwaggerModule.setup('cms/api/docs', app, initSwagger(app));

    const PORT = process.env.PORT || 6061;
    await app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
};

(async () => {
    await start();
})();