import { Inject, Injectable } from '@nestjs/common';
import { BadGatewayError } from '@sdk/ddd';
import { CURRENCY_CACHE_SERVICE, CURRENCY_REPO } from '../currency.di';
import type { CurrencyCodeVo } from '../domain';
import type { ICurrencyCachePort, ICurrencyRate, ICurrencyRepository } from '../interfaces';

@Injectable()
export class CurrencyUseCase {
  constructor(
    @Inject(CURRENCY_CACHE_SERVICE) private readonly cacheRepository: ICurrencyCachePort,
    @Inject(CURRENCY_REPO) private readonly currencyRepository: ICurrencyRepository,
  ) {}

  /**
   * Retrieves the currency exchange rate between two currencies.
   * @param from The source currency as a value object.
   * @param to The target currency as a value object.
   * @returns The exchange rate as a number.
   */
  public async getExchangeRate(from: CurrencyCodeVo, to: CurrencyCodeVo): Promise<number> {
    const currencyRates = await this.retrieveCurrencyRates();
    const rate = this.calculateRate(from.currencyCodeNumber, to.currencyCodeNumber, currencyRates);

    if (!rate) {
      throw new BadGatewayError('Failed to calculate exchange rate.');
    }

    return rate;
  }

  private async retrieveCurrencyRates(): Promise<Map<string, ICurrencyRate>> {
    const cache = await this.cacheRepository.getCurrencyRate();

    if (cache) {
      return cache;
    }

    const currencyRates = await this.currencyRepository.getCurrencyData();
    await this.cacheRepository.setCurrencyRate(currencyRates);

    return await this.cacheRepository.getCurrencyRate();
  }

  private calculateRate(
    from: number,
    to: number,
    currencyRates: Map<string, ICurrencyRate>,
  ): number {
    if (from === to) {
      return 1; // Same currency
    }

    const directKey = `${from}-${to}`;
    const reverseKey = `${to}-${from}`;

    // Direct conversion rate
    if (currencyRates.has(directKey)) {
      const rate = currencyRates.get(directKey);
      return rate?.rateSell || rate?.rateCross;
    }

    // Reverse conversion rate
    if (currencyRates.has(reverseKey)) {
      const rate = currencyRates.get(reverseKey);
      return 1 / (rate?.rateBuy || rate?.rateCross);
    }

    // Indirect conversion through intermediate currencies
    for (const [key, rate] of currencyRates) {
      const [intermediate, target] = key.split('-').map(Number);
      if (intermediate === from) {
        const intermediateRate = rate.rateBuy || rate.rateCross;
        const crossRate = this.calculateRate(target, to, currencyRates);
        if (crossRate) {
          return intermediateRate * crossRate;
        }
      }
    }

    return null; // Rate not found
  }
}
