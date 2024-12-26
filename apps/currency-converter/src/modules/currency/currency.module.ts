import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CurrencyCacheService } from './adapters';
import { CurrencyController } from './currency.controller';
import { CURRENCY_CACHE_SERVICE, CURRENCY_REPO } from './currency.di';
import { CurrencyService } from './domain';
import { MonobankRepository } from './repositories';

@Module({
  imports: [HttpModule],
  controllers: [CurrencyController],
  providers: [
    CurrencyService,
    { provide: CURRENCY_REPO, useClass: MonobankRepository },
    { provide: CURRENCY_CACHE_SERVICE, useClass: CurrencyCacheService },
  ],
  exports: [CurrencyService],
})
export class CurrencyModule {}
