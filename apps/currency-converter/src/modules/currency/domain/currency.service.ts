import { Inject, Injectable } from '@nestjs/common';
import type { GetCurrencyCommand } from '../commands';
import { CURRENCY_REPO } from '../currency.di';
import type { ICurrencyService } from '../interfaces';
import type { ICurrencyRepository } from '../interfaces/currency.repository';

@Injectable()
export class CurrencyService implements ICurrencyService {
  constructor(
    @Inject(CURRENCY_REPO)
    private readonly currencyRepository: ICurrencyRepository,
  ) {}

  async getCurrencyRate(command: GetCurrencyCommand): Promise<number> {
    const rate = await this.currencyRepository.getCurrencyRate(command.from, command.to);

    return command.amount * rate;
  }
}
