import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule, RedisModule } from '@sdk/nestjs';
import * as pino from 'nestjs-pino';

import { configuration } from '@sdk/common';
import { CONNECTION_NAME } from './app.di';
import config from './config';
import { CurrencyModule } from './modules/currency/currency.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ...configuration(config),
      isGlobal: true,
    }),
    LoggerModule,
    pino.LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const commonAppConfig = config.get('commonApp');
        const logsConfig = config.get('logs');

        return {
          pinoHttp: {
            autoLogging: false,
            quietReqLogger: true,
            formatters: { level: (label: string) => ({ level: label }) },
            customAttributeKeys: { reqId: 'pinoReqId' },
            base: { env: commonAppConfig.nodeEnv, service: commonAppConfig.name },
            level: logsConfig.level,
          },
        };
      },
    }),
    RedisModule.forRootAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const redisConfig = config.get('redis');
        return {
          ...redisConfig,
          connectionName: CONNECTION_NAME,
        };
      },
    }),
    CurrencyModule,
  ],
  controllers: [],
  providers: [],
  exports: [LoggerModule, pino.LoggerModule],
})
export class AppModule {}
