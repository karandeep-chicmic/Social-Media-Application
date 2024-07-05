import { AbstractControl, ValidatorFn } from '@angular/forms';

export function noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;

    if (control.value.split(' ').length > 1) {
      isValid = false;
    }
    return isValid ? null : { whitespace: 'value is only whitespace' };
  };
}
