import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import config from './config';
import { ApiResponse } from './api-response';
import { Session } from './models/session.model';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  async isLogged() {
    const session = this.session();

    if (!session?.token) return false;

    try {
      const res = await this.http.post<ApiResponse>(`${config.api_url}/auth/check`, { token: session.token }).toPromise();
      return res.valid;
    } catch {
      return false;
    }
  }

  async isNotLogged() {
    const logged = await this.isLogged();
    return !logged;
  }

  async login(username: string, password: string): Promise<ApiResponse> {
    const login = await this.http.post<ApiResponse>(`${config.api_url}/auth/login`, { username, password }).toPromise();

    if (login?.success) {
      const me = await this.http.get<ApiResponse>(`${config.api_url}/users/me?token=${login.token}`).toPromise();

      if (me?.success) {
        const session = JSON.stringify({
          token: login.token,
          user: me.profile,
        });

        localStorage.setItem('session', btoa(session));
      }

      return me;
    }

    return login;
  }

  signup(username: string, email: string, password: string) {
    return this.http.post<ApiResponse>(`${config.api_url}/auth/register`, { username, email, password }).pipe(res => res);
  }

  logout() {
    localStorage.removeItem('session');
  }

  session(): Session {
    const session = localStorage.getItem('session')

    if (!session) {
      return null;
    }

    return JSON.parse(atob(session))
  }
}
