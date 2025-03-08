import { Injectable } from "@nestjs/common";
import { configData } from "../config/core.config";
import Redis from 'ioredis';

@Injectable()
export default class RedisCache {
  private readonly prefix: string = configData.redis.prefix;
  private readonly redisClient: Redis;

  constructor() {
    this.redisClient = new Redis({
      host: configData.redis.host,
    });
  }

  private addPrefix(key: string): string {
    return `${this.prefix}:${key}`;
  }

  async get(key: string): Promise<string | null> {
    const prefixedKey = this.addPrefix(key);
    return await this.redisClient.get(prefixedKey);
  }

  async set(key: string, value: string): Promise<void> {
    const prefixedKey = this.addPrefix(key);
    await this.redisClient.set(prefixedKey, value);
  }

  async delete(key: string): Promise<void> {
    const prefixedKey = this.addPrefix(key);
    await this.redisClient.del(prefixedKey);
  }
}