import path from "path";
import {NestFactory} from '@nestjs/core';
import {EVENT_PACKAGE_NAME} from "./common";
import {EventsModule} from './events.module';
import {MicroserviceOptions, Transport} from "@nestjs/microservices";

const start = async () => {
    const app = await NestFactory.create(EventsModule);

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.GRPC,
        options: {
            protoPath: path.join(__dirname, "proto/event.proto"),
            package: EVENT_PACKAGE_NAME,
            loader: {longs: Number},
            url: process.env.URL
        }
    });

    const queue = "EVENT";
    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.RMQ,
        options: {
            urls: [process.env.RABBIT_MQ_URI!],
            queue: `RABBIT_MQ_${queue}_QUEUE`,
            noAck: true,
            persistent: true
        }
    });

    // const rmqService = app.get<RmqService>(RmqService);
    // app.connectMicroservice<RmqOptions>(rmqService.getOptions('EVENT', true));

    await app.startAllMicroservices();

    await app.listen(6004);
};

(async () => {
    await start();
})();
