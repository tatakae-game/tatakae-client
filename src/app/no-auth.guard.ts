import { Injectable } from '@angular/core';
import { CanActivate, CanDeactivate, Router } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate, CanDeactivate<unknown> {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): Promise<boolean> {
    return this.authService.isNotLogged();
  }

  canDeactivate(): Promise<boolean> {
    return this.authService.isNotLogged();
  }
}
