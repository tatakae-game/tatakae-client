import { Injectable } from '@angular/core';
import { CanActivate, CanDeactivate } from '@angular/router';
import { from, Observable } from 'rxjs';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanDeactivate<unknown> {
  constructor(private authService: AuthService) { }

  canActivate(): Promise<boolean> {
    return this.authService.isLogged();
  }

  canDeactivate(): Promise<boolean> {
    return this.authService.isLogged();
  }
}
