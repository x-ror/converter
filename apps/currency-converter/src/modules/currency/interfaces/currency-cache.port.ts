import type { ICurrencyRate } from './currency.repository';

export interface ICurrencyCachePort {
  getCurrencyRate(): Promise<Map<string, ICurrencyRate>>;
  setCurrencyRate(data: ICurrencyRate[]): Promise<void>;
}
