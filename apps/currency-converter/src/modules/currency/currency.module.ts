import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CurrencyCacheService } from './adapters';
import { CurrencyController } from './currency.controller';
import { CURRENCY_CACHE_SERVICE, CURRENCY_REPO } from './currency.di';
import { CurrencyService } from './domain';
import { MonoBankRepository } from './repositories';
import { CurrencyUseCase } from './usecases';

@Module({
  imports: [HttpModule],
  controllers: [CurrencyController],
  providers: [
    CurrencyService,
    CurrencyUseCase,
    { provide: CURRENCY_REPO, useClass: MonoBankRepository },
    { provide: CURRENCY_CACHE_SERVICE, useClass: CurrencyCacheService },
  ],
  exports: [CurrencyService],
})
export class CurrencyModule {}
