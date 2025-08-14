import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function notOnlyNumbersValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;
    return /^[0-9]+$/.test(value) ? { onlyNumbers: true } : null;
  };
}
