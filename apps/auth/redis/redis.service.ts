import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";

import {TokenPrefix} from "./enum";
import {RedisRepository} from "./redis.repository";
import {RedisOptions, Transport} from "@nestjs/microservices";

@Injectable()
export class RedisService {
    constructor(
      private readonly configService: ConfigService,
      private readonly redisRepository: RedisRepository
    ) {}

    getOptions(): RedisOptions {
        return {
            transport: Transport.REDIS,
            options: {
                host: this.configService.get<string>('REDIS_HOST'),
                port: Number(this.configService.get<string>('REDIS_PORT')),
                password: this.configService.get<string>('REDIS_PASSWORD')
            }
        };
    }

    checkAccessToken(token: string) {
        return this.redisRepository.get(TokenPrefix.ACCESS, token);
    }

    async saveAccessToken(token: string) {
        const expiredTime = Number(this.configService.get("ACCESS_TOKEN_EXPIRATION")) || (60 * 30);
        await this.redisRepository.setWithExpiry(TokenPrefix.ACCESS, token, "1", expiredTime);
    }

    checkRefreshToken(token: string) {
        return this.redisRepository.get(TokenPrefix.REFRESH, token);
    }

    async saveRefreshToken(token: string) {
        const expiredTime = Number(this.configService.get("REFRESH_TOKEN_EXPIRATION")) || (60 * 60 * 24 * 15);
        await this.redisRepository.setWithExpiry(TokenPrefix.REFRESH, token, "1", expiredTime);
    }
}