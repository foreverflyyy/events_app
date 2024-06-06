import {Module} from '@nestjs/common';
import {CmsService} from "./cms.service";
import {CmsController} from "./cms.controller";
import {MongooseModule} from "@nestjs/mongoose";
import {CmsUserRepository} from "../database/repositories";
import {CmsUser, CmsUserSchema} from "../database/schemas";
import {TokensService} from "../tokens/tokens.service";
import {APP_FILTER} from "@nestjs/core";
import {GrpcServerExceptionFilter} from "nestjs-grpc-exceptions";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: CmsUser.name, schema: CmsUserSchema}
        ])
    ],
    controllers: [CmsController],
    providers: [
        TokensService,
        CmsService, CmsUserRepository,
        {
            provide: APP_FILTER,
            useClass: GrpcServerExceptionFilter
        }
    ]
})

export class CmsModule {
}