import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { BadGatewayError } from '@sdk/ddd';
import { catchError, firstValueFrom, map } from 'rxjs';
import { CURRENCY_CACHE_SERVICE } from '../currency.di';
import type { CurrencyCodeVo } from '../domain';
import type { ICurrencyCachePort, ICurrencyRate, ICurrencyRepository } from '../interfaces';

@Injectable()
export class MonobankRepository implements ICurrencyRepository {
  constructor(
    @Inject(CURRENCY_CACHE_SERVICE) private readonly cacheService: ICurrencyCachePort,
    @Inject(HttpService) private readonly httpService: HttpService,
  ) {}

  private readonly MONOBANK_API_URL = 'https://api.monobank.ua/bank/currency';

  private async getCurrencyDate(): Promise<Map<string, ICurrencyRate>> {
    const currencyCache = await this.cacheService.getCurrencyRate();

    if (currencyCache) {
      return currencyCache;
    }

    const $observable = this.httpService.get(this.MONOBANK_API_URL).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.error(error);
        throw new BadGatewayError(
          'Failed to fetch data from Monobank API. Please try again later.',
        );
      }),
    );

    const currencyRate = await firstValueFrom($observable);
    await this.cacheService.setCurrencyRate(currencyRate);

    return currencyRate;
  }

  async getCurrencyRate(from: CurrencyCodeVo, to: CurrencyCodeVo): Promise<number> {
    const currencyRate = await this.getCurrencyDate();

    const rate = this.calculateRate(from.currencyCodeNumber, to.currencyCodeNumber, currencyRate);

    if (!rate) {
      throw new BadGatewayError('Failed to get currency rate');
    }

    return rate;
  }

  private calculateRate(
    from: number,
    to: number,
    currencyRate: Map<string, ICurrencyRate>,
  ): number {
    if (from === to) {
      return 1;
    }

    const directKey = `${from}-${to}`;
    const reverseKey = `${to}-${from}`;

    if (currencyRate.has(directKey)) {
      const rate = currencyRate.get(directKey);
      return rate.rateSell || rate.rateCross;
    }

    if (currencyRate.has(reverseKey)) {
      const rate = currencyRate.get(reverseKey);
      return 1 / (rate.rateBuy || rate.rateCross);
    }

    for (const [key, rate] of currencyRate) {
      const [intermediate, target] = key.split('-').map(Number);
      if (intermediate === from) {
        const intermediateRate = rate.rateBuy || rate.rateCross;
        const crossRate = this.calculateRate(target, to, currencyRate);
        if (crossRate) {
          return intermediateRate * crossRate;
        }
      }
    }
  }
}
