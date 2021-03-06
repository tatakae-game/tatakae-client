import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { first } from 'rxjs/operators';

import { AuthService } from '../../auth.service';
import { NotifierService } from 'angular-notifier';
import { from } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private notifierService: NotifierService
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {

  }

  onSubmit(data: any): void {
    from(this.authService.login(data.username, data.password)).pipe(first()).subscribe(
      res => {
        if (res?.success) {
          this.router.navigate(['/editor']); 
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
