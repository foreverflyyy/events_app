import {Global, Module} from '@nestjs/common';
import {JwtModule} from "@nestjs/jwt";
import {TokensService} from "./tokens.service";

@Global()
@Module({
    imports: [
        JwtModule.register({})
    ],
    providers: [TokensService],
    exports: [TokensService, JwtModule]
})

export class TokensModule {
}