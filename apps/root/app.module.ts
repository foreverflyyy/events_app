import Joi from "joi";
import path from "path";
import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {ThrottlerModule} from "@nestjs/throttler";
import {UsersModule} from "./users/users.module";
import {EventsModule} from "./events/events.module";
import {MapModule} from "./map/map.module";
import {NewsModule} from "./news/news.module";
import {FilesModule} from "./files/files.module";
import {RequestsModule} from "./requests/requests.module";
import {ConfigCommonModule} from "./config/config.module";
import {MongoModule} from "./database/mongo.module";
import {RmqModule} from "./rmq/rmq.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                MONGODB_URI: Joi.string().required(),
                FILES_URL: Joi.string().required(),
                AUTH_URL: Joi.string().required()
            }),
            envFilePath: path.join(__dirname, (process.env.PATH_TO_ENV || ".dev.env"))
        }),
        MongoModule,
        RmqModule.register({name: "LETTER_SERVICE"}),
        ThrottlerModule.forRoot([{ttl: 10 * 1000, limit: 100}]),
        UsersModule,
        EventsModule,
        MapModule,
        NewsModule,
        FilesModule,
        RequestsModule,
        ConfigCommonModule
    ]
})

export class AppModule {}