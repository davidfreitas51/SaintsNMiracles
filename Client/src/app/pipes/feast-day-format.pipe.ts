import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'feastDayFormat' })
export class FeastDayFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    const parts = value.split('-');
    if (parts.length !== 3) return value;

    const [year, month, day] = parts;
    if (year === '0001') {
      return `${day}/${month}`;
    }
    return `${day}/${month}/${year}`;
  }
}
