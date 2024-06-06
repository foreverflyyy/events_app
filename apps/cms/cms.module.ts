import Joi from "joi";
import path from "path";
import {Module} from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {AuthModule} from "./auth/auth.module";
import {ThrottlerModule} from "@nestjs/throttler";
import {StaffModule} from "./staff/staff.module";
import {RolesModule} from "./roles/roles.module";
import {PostgresModule} from "./database/postgres.module";
import {RequestsModule} from "./requests/requests.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                PG_DATABASE_HOST: Joi.string().required(),
                PG_DATABASE_PORT: Joi.string().required(),
                PG_DATABASE_USERNAME: Joi.string().required(),
                PG_DATABASE_PASSWORD: Joi.string().required(),
                PG_DATABASE_NAME: Joi.string().required(),
                FILES_URL: Joi.string().required(),
                AUTH_URL: Joi.string().required()
            }),
            envFilePath: path.join(__dirname, (process.env.PATH_TO_ENV || ".dev.env"))
        }),
        ThrottlerModule.forRoot([{ttl: 10 * 1000, limit: 100}]),
        PostgresModule,
        StaffModule,
        RolesModule,
        AuthModule,
        RequestsModule
    ]
})
export class CmsModule {
}
