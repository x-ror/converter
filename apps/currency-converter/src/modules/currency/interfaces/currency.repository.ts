import type { CurrencyCodeVo } from '../domain';

export interface ICurrencyRate {
  currencyCodeA: number;
  currencyCodeB: number;
  rateBuy?: number;
  rateSell?: number;
  rateCross?: number;
}

export interface ICurrencyRepository {
  getCurrencyRate(from: CurrencyCodeVo, to: CurrencyCodeVo): Promise<number>;
}
