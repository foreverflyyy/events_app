import path from "path";
import {readFileSync} from "fs";
import {TokenPayload} from "../common";
import {JwtService} from "@nestjs/jwt";
import {Injectable} from '@nestjs/common';

enum TokenType {
    ACCESS_TOKEN = "access_token",
    REFRESH_TOKEN = "refresh_token",
}

@Injectable()
export class TokensService {
    PRIVATE_KEY = readFileSync(path.join(__dirname, '../../../configs/private_key.pem'), 'utf8');

    constructor(
        private jwtService: JwtService
    ) {
    }

    checkToken = (token: string, tokenType: TokenType = TokenType.ACCESS_TOKEN) => {
        let secret = process.env.ACCESS_TOKEN_SECRET!;
        if (tokenType === TokenType.REFRESH_TOKEN) {
            secret = this.PRIVATE_KEY;
        }

        try {
            return this.jwtService.verify<TokenPayload>(token, {secret: secret});
        } catch (err) {
            return null;
        }
    };

    generateTokens(data: TokenPayload) {
        const {id, login, role} = data;
        if (!id || !login || !role) {
            return null;
        }

        const accessToken = this.jwtService.sign(
            {id, login, role},
            {
                secret: process.env.ACCESS_TOKEN_SECRET,
                expiresIn: "30m"
            }
        );

        const refreshToken = this.jwtService.sign({id, login, role}, {
            secret: this.PRIVATE_KEY,
            algorithm: 'RS256',
            expiresIn: '30d'
        });

        return {accessToken, refreshToken};
    };
}
