import { Inject, Injectable } from '@nestjs/common';
import type { GetCurrencyCommand } from '../commands';
import type { ICurrencyService } from '../interfaces';
import { CurrencyUseCase } from '../usecases';

@Injectable()
export class CurrencyService implements ICurrencyService {
  constructor(@Inject(CurrencyUseCase) private readonly currencyUseCase: CurrencyUseCase) {}

  async getCurrencyRate(command: GetCurrencyCommand): Promise<number> {
    const rate = await this.currencyUseCase.getExchangeRate(command.from, command.to);

    return command.amount * rate;
  }
}
