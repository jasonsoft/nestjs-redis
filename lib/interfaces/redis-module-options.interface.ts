import { FactoryProvider, ModuleMetadata, Type } from '@nestjs/common';
import { Redis, RedisOptions } from 'ioredis';

export { Redis };

/**
 * Redis Module Options interface
 * Added by Jason.Song (成长的小猪) on 2023/03/16 23:02:57
 */
export interface RedisModuleOptions extends RedisOptions {
  /**
   * URI scheme to be used to specify connection options as a redis:// URL or rediss:// URL.
   * @example
   * ```ts
   * // Connect to 127.0.0.1:6380, db 4, using password "authpassword":
   * 'redis://:authpassword@127.0.0.1:6380/4'
   *
   * // Username can also be passed via URI.
   * 'redis://username:authpassword@127.0.0.1:6380/4'
   * ```
   */
  url?: string;
}

export interface RedisModuleOptionsFactory {
  createRedisModuleOptions(): Promise<RedisModuleOptions> | RedisModuleOptions;
}

/**
 * Redis Module Async Options interface
 */
export interface RedisModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  /**
   * Existing Provider to be used.
   */
  useExisting?: Type<RedisModuleOptionsFactory>;

  /**
   * Type (class name) of provider (instance to be registered and injected).
   */
  useClass?: Type<RedisModuleOptionsFactory>;

  /**
   * Factory function that returns an instance of the provider to be injected.
   */
  useFactory?: (
    ...args: any[]
  ) => Promise<RedisModuleOptions> | RedisModuleOptions;

  /**
   * Optional list of providers to be injected into the context of the Factory function.
   */
  inject?: FactoryProvider['inject'];
}
