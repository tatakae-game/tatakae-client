import { AbstractControl, ValidationErrors } from '@angular/forms';
import * as XRegExp from 'xregexp'

export function ValidateUsername(control: AbstractControl): ValidationErrors | null {
  const usernameRegExp = XRegExp('^[\\p{L}0-9_]{2,20}$');

  if (!usernameRegExp.test(control.value)) {
    return { validUsername: true };
  }

  return null;
}

export function ValidateEmail(control: AbstractControl): ValidationErrors | null {
  const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!emailRegExp.test(control.value) || control.value.length > 256) {
    return { validEmail: true };
  }

  return null;
}

export function ValidatePassword(control: AbstractControl): ValidationErrors | null {
  const passwordRegExp = /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

  if (!passwordRegExp.test(control.value)) {
    return { validPassword: true };
  }

  return null;
}
