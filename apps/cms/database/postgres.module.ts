import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigService} from "@nestjs/config";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>("PG_DATABASE_HOST"),
                port: Number(configService.get<string>("PG_DATABASE_PORT")),
                username: configService.get<string>("PG_DATABASE_USERNAME"),
                password: configService.get<string>("PG_DATABASE_PASSWORD"),
                database: configService.get<string>("PG_DATABASE_NAME"),
                autoLoadEntities: true,
                synchronize: true
            }),
            inject: [ConfigService]
        })
    ]
})
export class PostgresModule {}