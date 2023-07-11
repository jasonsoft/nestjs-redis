<p align="center">
  <a href="https://github.com/jasonsoft/" target="blank"><img src="https://avatars.githubusercontent.com/u/90173752?s=200&v=4" width="120" alt="JasonSoft Logo" /></a>
  <a href="http://nestjs.com/" target="blank"><img src="https://avatars.githubusercontent.com/u/28507035?s=200&v=4" width="120" alt="Nest Logo" /></a>
  <a href="https://github.com/luin/ioredis" target="blank"><img src="https://camo.githubusercontent.com/ad27b417b2b5b45843309bd82134121581bce291cda4ee94539b72c20e9bfc47/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6c75696e2f696f726564697340623565386337342f6c6f676f2e737667" height="120"  alt="ioredis Logo" /></a>
</p>

# nestjs-redis

Redis(ioredis) module for Nest framework (node.js) 🚀

[![NPM version][npm-img]][npm-url]
[![NPM Downloads][downloads-image]][npm-url]
[![License][license-img]][license-url]

## Installation

```bash
$ npm i --save @jasonsoft/nestjs-redis ioredis
```

## Usage

Import `RedisModule`:

```typescript
@Module({
  imports: [
    RedisModule.forRoot({
      isGlobal: true,
      url: 'redis://username:password@localhost:6379',
    }),
  ],
  providers: [...],
})
export class AppModule {}
```

```typescript
@Module({
  imports: [
    RedisModule.forRoot({
      port: 6379, // Redis port
      host: 'localhost', // Redis host
      username: 'default', // needs Redis >= 6
      password: 'password',
      db: 0, // Defaults to 0
    }),
  ],
  providers: [...],
})
export class AppModule {}
```

Inject `RedisCacheHelper`:

```typescript
@Injectable()
export class AppService {
  constructor(private readonly redisCacheHelper: RedisCacheHelper) {}
}
```

## Async options

Quite often you might want to asynchronously pass your module options instead of passing them beforehand. In such case, use `forRootAsync()` method.

```typescript
RedisModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    url: configService.get('REDIS_URL'),
  }),
  inject: [ConfigService],
}),
```

## Example

```typescript
import { RedisCacheHelper } from '@jasonsoft/nestjs-redis';
import { Injectable } from '@nestjs/common';

export interface User {
  id: number;
  name: string;
  age: number;
}

export const USERS: User[] = [
  {
    id: 1,
    name: 'Jason Song',
    age: 18,
  },
  {
    id: 2,
    name: '成长的小猪',
    age: 30,
  },
];

@Injectable()
export class AppService {
  constructor(private readonly redisCacheHelper: RedisCacheHelper) {}

  async getUser(id: number): Promise<User> {
    const cacheKey = `user:${id}`;
    let user = await this.redisCacheHelper.getAsObj<User>(cacheKey);
    if (!user) {
      user = USERS.find((user) => user.id === id);
      if (user) {
        await this.redisCacheHelper.set(cacheKey, user);
      }
    }
    return user;
  }

  async commonOperation() {
    /** string type */
    await this.redisCacheHelper.set('string:type', 'test', 60);
    const stringValue = await this.redisCacheHelper.getAsStr('string:type');

    /** number type */
    await this.redisCacheHelper.set('number:type', 1, '30m');
    const numberValue = await this.redisCacheHelper.getAsNum('number:type');

    /** boolean type */
    await this.redisCacheHelper.set('boolean:type', true, '8h');
    const booleanValue = await this.redisCacheHelper.getAsBool('boolean:type');

    /** object:type */
    const user = USERS.find((user) => user.name === 'Jason Song');
    await this.redisCacheHelper.set('object:type', user, '7d');
    const objectValue = await this.redisCacheHelper.getAsObj<User>(
      'object:type',
    );
  }
}
```

[npm-img]: https://img.shields.io/npm/v/@jasonsoft/nestjs-redis.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@jasonsoft/nestjs-redis
[license-img]: https://img.shields.io/badge/license-MIT-green.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: https://img.shields.io/npm/dt/@jasonsoft/nestjs-redis.svg?style=flat-square
[project-icon]: https://avatars.githubusercontent.com/u/22167571?v=4
