import { Injectable } from '@angular/core';
import {CanActivate, Router, UrlTree} from '@angular/router';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class NoAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  async canActivate(): Promise<boolean | UrlTree> {
    return await this.authService.isNotLogged() || this.router.parseUrl("/editor");
  }
}
