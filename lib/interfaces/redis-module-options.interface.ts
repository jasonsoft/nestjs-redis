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

  /**
   * Use module globally
   * When you want to use RedisModule in other modules,
   * you'll need to import it (as is standard with any Nest module).
   * Alternatively, declare it as a global module by setting the options object's isGlobal property to true, as shown below.
   * In that case, you will not need to import RedisModule in other modules once it's been loaded in the root module
   */
  isGlobal?: boolean;
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
