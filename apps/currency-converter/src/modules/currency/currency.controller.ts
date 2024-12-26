import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { GetCurrencyCommand } from './commands';
import { CurrencyService } from './domain/currency.service';
import { GetCurrencyBody } from './dtos';

@ApiTags('currency')
@Controller('currency')
export class CurrencyController {
  constructor(@Inject(CurrencyService) private readonly currencyService: CurrencyService) {}

  @Post('convert')
  @ApiBody({ type: GetCurrencyBody })
  async convertCurrency(@Body() body: GetCurrencyBody): Promise<number> {
    const currencyCommand = new GetCurrencyCommand({
      amount: body.amount,
      from: body.from,
      to: body.to,
    });

    return await this.currencyService.getCurrencyRate(currencyCommand);
  }
}
