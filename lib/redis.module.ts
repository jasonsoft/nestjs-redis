import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import Redis from 'ioredis';
import {
  RedisModuleOptions,
  RedisModuleAsyncOptions,
  RedisModuleOptionsFactory,
} from './interfaces';
import { RedisCacheHelper } from './redis-cache.helper';
import { JASONSOFT_REDIS, JASONSOFT_REDIS_OPTIONS } from './redis.constants';

/**
 * JasonSoft Redis Module
 * Added by Jason.Song (成长的小猪) on 2023/03/16 23:02:18
 */
@Module({})
export class RedisModule {
  static forRoot(options: RedisModuleOptions): DynamicModule {
    return {
      module: RedisModule,
      global: true,
      providers: [
        {
          provide: JASONSOFT_REDIS_OPTIONS,
          useValue: options,
        },
        {
          provide: JASONSOFT_REDIS,
          useFactory: () => {
            return this.createRedisClient(options);
          },
        },
        RedisCacheHelper,
      ],
      exports: [JASONSOFT_REDIS, RedisCacheHelper],
    };
  }

  private static createRedisClient(options: RedisModuleOptions) {
    const { url, ...redisOptions } = options;
    if (url) {
      return new Redis(url, redisOptions);
    }
    return new Redis(options);
  }

  static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
    return {
      module: RedisModule,
      global: true,
      imports: options.imports || [],
      providers: [
        ...this.createAsyncProviders(options),
        {
          provide: JASONSOFT_REDIS,
          useFactory: (options: RedisModuleOptions) => {
            return this.createRedisClient(options);
          },
          inject: [JASONSOFT_REDIS_OPTIONS],
        },
        RedisCacheHelper,
      ],
      exports: [JASONSOFT_REDIS, RedisCacheHelper],
    };
  }

  private static createAsyncProviders(
    options: RedisModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<RedisModuleOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    asyncOptions: RedisModuleAsyncOptions,
  ): Provider {
    if (asyncOptions.useFactory) {
      return {
        provide: JASONSOFT_REDIS_OPTIONS,
        useFactory: asyncOptions.useFactory,
        inject: asyncOptions.inject || [],
      };
    }

    return {
      provide: JASONSOFT_REDIS_OPTIONS,
      useFactory: async (optionsFactory: RedisModuleOptionsFactory) =>
        optionsFactory.createRedisModuleOptions(),
      inject: [
        (asyncOptions.useClass ||
          asyncOptions.useExisting) as Type<RedisModuleOptionsFactory>,
      ],
    };
  }
}
