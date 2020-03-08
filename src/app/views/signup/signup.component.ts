import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { first } from 'rxjs/operators';

import { ValidateUsername, ValidateEmail, ValidatePassword } from '../../validators/user.validator';
import { AuthService } from '../../auth.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signUpForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private notifierService: NotifierService
  ) {
    this.signUpForm = this.formBuilder.group({
      username: ['', [Validators.required, ValidateUsername]],
      email: ['', [Validators.required, ValidateEmail]],
      password: ['', [Validators.required, ValidatePassword]],
    });
  }

  get username() { return this.signUpForm.get('username'); }
  get email() { return this.signUpForm.get('email'); }
  get password() { return this.signUpForm.get('password'); }

  ngOnInit(): void {

  }

  onSubmit(data: any): void {
    this.authService.signup(data.username, data.email, data.password).pipe(first()).subscribe(
      res => {
        if (res?.success) {
          this.notifierService.notify('success', 'Account successfully created. You can now enter your credentials.');
          this.router.navigate(['/login']);
        } else if (res?.errors) {
          res.errors.forEach((err) => {
            this.notifierService.notify('error', err);
          });
        }
      },
      error => {
        this.notifierService.notify('error', 'An error occurred while trying to reach the server.');
      }
    );
  }
}
