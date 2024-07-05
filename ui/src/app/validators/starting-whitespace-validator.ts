import { AbstractControl, ValidatorFn } from '@angular/forms';

export function noStartingWhiteSpace(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;

    return isValid ? null : { whitespace: 'value is only whitespace' };
  };
}
