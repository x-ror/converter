import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { BadGatewayError } from '@sdk/ddd';
import { LOGGER_SERVICE, type LoggerService } from '@sdk/nestjs';
import { catchError, firstValueFrom, map } from 'rxjs';
import type { ICurrencyRate, ICurrencyRepository } from '../interfaces';

@Injectable()
export class MonoBankRepository implements ICurrencyRepository {
  constructor(
    @Inject(HttpService) private readonly httpService: HttpService,
    @Inject(LOGGER_SERVICE) private readonly logger: LoggerService,
  ) {}

  private readonly MONOBANK_API_URL = 'https://api.monobank.ua/bank/currency';

  public async getCurrencyData(): Promise<ICurrencyRate[]> {
    const $observable = this.httpService.get(this.MONOBANK_API_URL).pipe(
      map((response) => response.data),
      catchError((error) => {
        this.logger.error(error);
        throw new BadGatewayError(
          'Failed to fetch data from Monobank API. Please try again later.',
        );
      }),
    );

    return await firstValueFrom($observable);
  }
}
