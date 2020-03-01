import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { first } from 'rxjs/operators';

import { ValidateUsername, ValidateEmail, ValidatePassword } from '../validators/user.validator';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signUpForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService) {
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
    console.log(data)
    this.authService.signup(data.username, data.email, data.password).pipe(first()).subscribe(
      res => {
        console.log(res);
        if (res?.success) {
          this.router.navigate(['/']);
        } else if (res?.errors) {
          console.log(res.errors)
        }
      },
      error => {
        console.log(error)
      }
    );
  }
}
