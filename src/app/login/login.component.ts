import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { first } from 'rxjs/operators';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {

  }

  onSubmit(data: any): void {
    this.authService.login(data.username, data.password).pipe(first()).subscribe(
      res => {
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
