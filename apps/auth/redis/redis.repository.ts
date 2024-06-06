import Redis from "ioredis";
import {Inject, Injectable, OnModuleDestroy} from "@nestjs/common";

@Injectable()
export class RedisRepository implements OnModuleDestroy{
    constructor(
      @Inject("RedisClient") private readonly redisClient: Redis
    ) {}

    onModuleDestroy(): void {
        this.redisClient.disconnect();
    }

     get(prefix: string, key: string) {
         return this.redisClient.get(`${prefix}:${key}`);
    }

    async set(prefix: string, key: string, value: any) {
        await this.redisClient.set(`${prefix}:${key}`, value);
    }

    async delete(prefix: string, key: string) {
        await this.redisClient.del(`${prefix}:${key}`);
    }

    async setWithExpiry(prefix: string, key: string, value: string, expiry: number) {
        await this.redisClient.set(`${prefix}:${key}`, value, 'EX', expiry);
    }
}