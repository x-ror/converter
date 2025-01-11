export interface ICurrencyRate {
  currencyCodeA: number;
  currencyCodeB: number;
  rateBuy?: number;
  rateSell?: number;
  rateCross?: number;
}

export interface ICurrencyRepository {
  getCurrencyData(): Promise<ICurrencyRate[]>;
}
