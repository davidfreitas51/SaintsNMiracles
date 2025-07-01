import { Pipe, PipeTransform } from '@angular/core';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';

countries.registerLocale(enLocale);

@Pipe({ name: 'countryCode', standalone: true })
export class CountryCodePipe implements PipeTransform {
  transform(countryName: string | null | undefined): string | null {
    if (!countryName) return null;
    const code = countries.getAlpha2Code(countryName, 'en');
    return code ? code.toLowerCase() : null;
  }
}
