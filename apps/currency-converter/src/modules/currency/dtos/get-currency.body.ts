import { ApiProperty } from '@nestjs/swagger';
import { IsISO4217CurrencyCode, IsNotEmpty, IsNumber } from 'class-validator';

export class GetCurrencyBody {
  @ApiProperty({
    example: 'USD',
    description: 'Source currency in ISO 4217 format',
    required: true,
  })
  @IsISO4217CurrencyCode()
  from: string;

  @ApiProperty({
    example: 'EUR',
    description: 'Target currency in ISO 4217 format',
    required: true,
  })
  @IsISO4217CurrencyCode()
  to: string;

  @ApiProperty({ example: 100, description: 'Amount to be converted', required: true })
  @IsNumber()
  amount: number;
}
