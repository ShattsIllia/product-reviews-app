import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'price',
  standalone: true,
  pure: true,
})
export class PricePipe implements PipeTransform {
  transform(value: number | null | undefined, currencySymbol: string = '$'): string {
    if (value == null || Number.isNaN(value)) return `${currencySymbol}0.00`;
    return `${currencySymbol}${value.toFixed(2)}`;
  }
}
