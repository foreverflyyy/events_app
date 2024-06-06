import Redis from 'ioredis';
import { FactoryProvider } from '@nestjs/common';

export const redisClientFactory: FactoryProvider = {
  provide: "RedisClient",
  useFactory: () => {
    const redisInstance = new Redis({
      host: "127.0.0.1",
      // host: "185.68.22.19",
      port: 6379,
      password: "root"
    });
    redisInstance.on('error', e => {
      throw new Error(`Redis connection failed: ${e}`);
    });

    return redisInstance;
  }
};