import type { GetCurrencyCommand } from '../commands';

export interface ICurrencyService {
  getCurrencyRate(command: GetCurrencyCommand): Promise<number>;
}
