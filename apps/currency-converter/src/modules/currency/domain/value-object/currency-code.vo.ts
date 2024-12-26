import { ArgumentInvalidError, type DomainPrimitive, ValueObject } from '@sdk/ddd';
import { isISO4217CurrencyCode } from 'class-validator';
import cc from 'currency-codes';

export class CurrencyCodeVo extends ValueObject<string> {
  constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public get currencyCodeNumber(): number {
    return Number(cc.code(this.value).number);
  }

  protected validate({ value }: DomainPrimitive<string>): void {
    if (!isISO4217CurrencyCode(value)) {
      throw new ArgumentInvalidError('Currency code is invalid');
    }

    if (!cc.code(value)) {
      throw new ArgumentInvalidError('Currency code is not supported');
    }
  }
}
