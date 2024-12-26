import { CurrencyCodeVo } from '../domain';

export interface IGetCurrencyCommandProps {
  from: string | CurrencyCodeVo;
  to: string | CurrencyCodeVo;
  amount: number;
}

export class GetCurrencyCommand {
  constructor(props: IGetCurrencyCommandProps) {
    this.from = props.from instanceof CurrencyCodeVo ? props.from : new CurrencyCodeVo(props.from);
    this.to = props.to instanceof CurrencyCodeVo ? props.to : new CurrencyCodeVo(props.to);
    this.amount = props.amount;
  }

  public readonly from: CurrencyCodeVo;
  public readonly to: CurrencyCodeVo;
  public readonly amount: number;
}
