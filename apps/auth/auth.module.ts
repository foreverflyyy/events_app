import Joi from "joi";
import path from "path";
import {Module} from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {ThrottlerModule} from "@nestjs/throttler";
import {MongoModule} from "./database/mongo.module";
import {CmsModule} from "./cms/cms.module";
import {TokensModule} from "./tokens/tokens.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                MONGODB_URI: Joi.string().required()
            }),
            envFilePath: path.join(__dirname, (process.env.PATH_TO_ENV || ".dev.env"))
        }),
        TokensModule,
        MongoModule,
        ThrottlerModule.forRoot([{ttl: 10 * 1000, limit: 100}]),
        CmsModule
    ]
})

export class AuthModule {
}