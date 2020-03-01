import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import config from './config';
import { ApiResponse } from './api-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  async isLogged() {
    const token = localStorage.getItem('token')

    if (!token) return false;

    try {
      const res = await this.http.post<ApiResponse>(`${config.api_url}/auth/check`, { token }).toPromise()
      return res.valid;
    } catch {
      return false;
    }
  }

  async isNotLogged() {
    const logged = await this.isLogged();
    return !logged;
  }

  login(username: string, password: string) {
    return this.http.post<ApiResponse>(`${config.api_url}/auth/login`, { username, password })
      .pipe(map(res => {
        if (res?.success) {
          localStorage.setItem('token', res.token);
        }

        return res;
      }));
  }

  signup(username: string, email: string, password: string) {
    return this.http.post<ApiResponse>(`${config.api_url}/auth/register`, { username, email, password }).pipe(res => res);
  }

  logout() {
    localStorage.removeItem('token');
  }
}
