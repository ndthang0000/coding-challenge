import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import coreConfig, { configData } from './infrastructure/config/core.config';
import { MongooseModule } from '@nestjs/mongoose';
import { RepositoryServices } from './infrastructure/mongoose/repository';
import { NameAndSchema } from './infrastructure/mongoose/schemas';
import RedisCache from './infrastructure/redis/RedisCache';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [coreConfig],
    }),
    MongooseModule.forRoot(configData.database.uri, {
      ssl: configData.database.ssl,
      dbName: configData.database.dbName,
      tls: process.env.DB_SSL === 'true',
    }),
    MongooseModule.forFeature([...NameAndSchema]),
    BullModule.forRoot({ redis: { host: configData.redis.host, port: configData.redis.port } }),
    BullModule.registerQueue({ name: 'sessionQueue' }),
    BullModule.registerQueue({ name: 'taskQueue' }),
  ],
  providers: [...RepositoryServices, RedisCache],
  exports: [ConfigModule, CoreModule, ...RepositoryServices, RedisCache, BullModule],
})
export class CoreModule { }
