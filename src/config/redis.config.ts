import { RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { Logger } from '@nestjs/common';

export function redisConfiguration(): RedisModuleOptions {
  const { REDIS_HOST, REDIS_PORT, REDIS_DB } = process.env;

  return {
    config: {
      host: REDIS_HOST,
      port: +REDIS_PORT,
      db: +REDIS_DB,
      onClientCreated(client: Redis): void {
        client.on('connect', () =>
          Logger.log(
            `Redis service available on ${REDIS_HOST}:${REDIS_PORT} using db index ${REDIS_DB}`,
            'app.config@redisConfiguration',
            true,
          ),
        );

        client.on('error', (error) =>
          Logger.error(
            `Redis service error: ${error.message}`,
            error.trace,
            'app.config@redisConfiguration',
            true,
          ),
        );

        // return;
      },
    },
  };
}
