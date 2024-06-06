import Joi from "joi";
import path from "path";
import {ConfigModule} from "@nestjs/config";
import {SearchService} from './search.service';
import {Module, OnModuleInit} from '@nestjs/common';
import {SearchController} from './search.controller';
import {ElasticsearchModule} from "@nestjs/elasticsearch";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                ELASTIC_NODE: Joi.string().required(),
                ELASTIC_PORT: Joi.string().required(),
                ELASTIC_INDEX: Joi.string().required(),
                ELASTIC_USER: Joi.string().required(),
                ELASTIC_PASSWORD: Joi.string().required()
            }),
            envFilePath: path.join(__dirname, (process.env.PATH_TO_ENV || ".dev.env"))
        }),
        ElasticsearchModule.register({
            node: process.env.ELASTIC_NODE,
            maxRetries: 10,
            requestTimeout: 60000,
            auth: {
                username: process.env.ELASTIC_USER!,
                password: process.env.ELASTIC_PASSWORD!
            }
        })
    ],
    controllers: [SearchController],
    providers: [SearchService],
    exports: [ElasticsearchModule, SearchService]
})
// export class SearchModule {}
export class SearchModule implements OnModuleInit {
    constructor(private readonly searchService: SearchService){}
    public async onModuleInit() {
        await this.searchService.createIndex();
    }
}