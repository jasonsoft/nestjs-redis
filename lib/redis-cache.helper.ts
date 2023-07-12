import { Injectable } from '@nestjs/common';
import { Redis } from './interfaces';
import { InjectRedis } from './redis.decorator';

/**
 * Redis Cache Helper
 * Added by Jason.Song (成长的小猪) on 2023/03/16 23:59:41
 */
@Injectable()
export class RedisCacheHelper {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  /**
   * Set specified type data
   * Added by Jason.Song (成长的小猪) on 2023/03/17 00:01:01
   * @param key
   * @param value
   * @param expire Set a key's time to live in seconds, for example: 60, "30m", "8h", "7d". Values are interpreted as counts of seconds. If you use strings, make sure to provide time units (minutes, hours, days, etc.)
   * @returns
   */
  async set(
    key: string,
    value: string | number | boolean | object,
    expire?: number | string,
  ): Promise<boolean> {
    let result: string;
    if (typeof value === 'object') {
      result = await this.redis.set(key, Buffer.from(JSON.stringify(value)));
    } else if (typeof value === 'boolean') {
      result = await this.redis.set(key, value.toString());
    } else {
      result = await this.redis.set(key, value);
    }
    if (expire) {
      let seconds: number;
      if (typeof expire === 'string') {
        const matchArray = expire.match(/(\d+)([mhd])/);
        if (!matchArray) {
          throw new Error(
            'Invalid ttl format, if you use strings, make sure to provide time units (minutes, hours, days, etc.), for example: "30m", "8h", "7d"',
          );
        }
        const [, num, unit] = matchArray;
        const multiplier: Record<string, number> = {
          m: 60,
          h: 60 * 60,
          d: 24 * 60 * 60,
        };
        seconds = Math.floor(parseInt(num) * multiplier[unit]);
      } else {
        seconds = expire;
      }
      await this.redis.expire(key, seconds);
    }
    return result === 'OK';
  }

  /**
   * delete key
   * Added by Jason.Song (成长的小猪) on 2023/03/17 00:12:53
   * @param keys
   * @returns
   */
  async del(...keys: string[]): Promise<number> {
    return this.redis.del(keys);
  }

  /**
   * Get string type data by key
   * Added by Jason.Song (成长的小猪) on 2023/03/17 00:13:31
   * @param key
   * @param defaults
   * @returns
   */
  async getAsStr(key: string, defaults?: string): Promise<string | undefined> {
    const value = await this.redis.get(key);
    if (!value) {
      return defaults;
    }
    return value;
  }

  /**
   * Get number type data by key
   * Added by Jason.Song (成长的小猪) on 2023/03/17 00:14:39
   * @param key
   * @param defaults
   * @returns
   */
  async getAsNum(key: string, defaults?: number): Promise<number | undefined> {
    const value = await this.redis.get(key);
    if (!value) {
      return defaults;
    }
    return +value;
  }

  /**
   * Get boolean type data by key
   * Added by Jason.Song (成长的小猪) on 2023/03/17 00:18:03
   * @param key
   * @param defaults
   * @returns
   */
  async getAsBool(
    key: string,
    defaults?: boolean,
  ): Promise<boolean | undefined> {
    const value = await this.redis.get(key);
    if (!value) {
      return defaults;
    }
    return ['true', 'True', '1'].includes(value);
  }

  /**
   * Get object type data by key
   * Added by Jason.Song (成长的小猪) on 2023/03/17 00:21:07
   * @param key
   * @param defaults
   * @returns
   */
  async getAsObj<T>(key: string, defaults?: T): Promise<T | undefined> {
    const value = await this.redis.get(key);
    if (!value) {
      return defaults;
    }
    return JSON.parse(value) as T;
  }
}
