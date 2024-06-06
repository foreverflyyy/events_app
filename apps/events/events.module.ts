import Joi from "joi";
import path from "path";
import {Module} from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {RequestsModule} from "./requests/requests.module";
import {MongoModule} from "./database/mongo.module";
import {OperationsModule} from "./operations/operations.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                MONGODB_URI: Joi.string().required(),
                URL: Joi.string().required(),
                RABBIT_MQ_URI: Joi.string().required()
            }),
            envFilePath: path.join(__dirname, (process.env.PATH_TO_ENV || ".dev.env"))
        }),
        MongoModule,
        RequestsModule,
        OperationsModule
    ],
    exports: [ConfigModule]
})
export class EventsModule {
}
