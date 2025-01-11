import { Inject, Injectable } from '@nestjs/common';
import { SECONDS_IN_MINUTE } from '@sdk/common';
import { RedisService } from '@sdk/nestjs';
import type { ICurrencyCachePort, ICurrencyRate } from '../interfaces';

@Injectable()
export class CurrencyCacheService implements ICurrencyCachePort {
  private static readonly CACHE_KEY = 'currency:rate';
  private static readonly CACHE_TTL = SECONDS_IN_MINUTE * 5; // 5 minutes in seconds

  constructor(@Inject(RedisService) private readonly cacheService: RedisService) {}

  async getCurrencyRate(): Promise<Map<string, ICurrencyRate>> {
    const data = await this.cacheService.get(CurrencyCacheService.CACHE_KEY);

    if (!data) {
      return null;
    }

    const currencyRate: ICurrencyRate[] = JSON.parse(data);

    return new Map(
      currencyRate.map((rate) => [`${rate.currencyCodeA}-${rate.currencyCodeB}`, rate]),
    );
  }

  async setCurrencyRate(data: ICurrencyRate[]): Promise<void> {
    await this.cacheService.set(CurrencyCacheService.CACHE_KEY, JSON.stringify(data), {
      ttl: CurrencyCacheService.CACHE_TTL,
    });
  }
}
