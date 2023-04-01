import { Inject } from '@nestjs/common';
import { JASONSOFT_REDIS } from './redis.constants';

/**
 * Inject Jasonsoft Redis client
 * Added by Jason.Song (成长的小猪) on 2023/03/16 23:05:25
 */
export const InjectRedis = (): ParameterDecorator => {
  return Inject(JASONSOFT_REDIS);
};
