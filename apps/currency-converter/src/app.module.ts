import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '@sdk/nestjs';

import { CONNECTION_NAME } from './app.di';
import { CurrencyModule } from './modules/currency/currency.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RedisModule.forRootAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        ...config.get('redis'),
        connectionName: CONNECTION_NAME,
      }),
    }),
    CurrencyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
