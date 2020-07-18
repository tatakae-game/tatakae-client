import { Injectable } from '@angular/core';
import {CanActivate, UrlTree, Router} from '@angular/router';
import {AuthService} from "./auth.service";
import {UsersService} from "./services/users.service";

@Injectable({
  providedIn: 'root'
})

export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService,
              private router: Router,
              private userService: UsersService) {}

  async canActivate(): Promise<boolean | UrlTree> {
    const isAdmin = await this.userService.isAdmin();
    const isAdminAndAuthed = await this.authService.isLogged() && isAdmin;

    return isAdminAndAuthed || this.router.parseUrl('/editor');
  }
}
