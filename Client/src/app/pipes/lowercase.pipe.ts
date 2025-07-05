import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lowercase',
  standalone: true,
})
export class LowercasePipe implements PipeTransform {
  transform(value: unknown): string {
    if (typeof value !== 'string') return '';
    return value.toLowerCase();
  }
}
