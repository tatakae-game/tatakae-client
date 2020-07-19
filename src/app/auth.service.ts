import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import config from './config';
import { ApiResponse } from './api-response';
import { Session } from './models/session.model';

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

      if (!res.valid) {
        this.logout();
      }

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
      const me =  this.lazy_load_session(login.token);
      return me;
    }

    return login;
  }

  signup(username: string, email: string, password: string) {
    return this.http.post<ApiResponse>(`${config.api_url}/auth/register`, { username, email, password }).pipe(res => res);
  }

  logout() {
    localStorage.clear()
  }

  async lazy_load_session(token) {
    try {
      console.log('try request')
      let me
      if(await this.isLogged()){
        me = await this.http.get<ApiResponse>(`${config.api_url}/users/me`).toPromise();
      } else {
        me = await this.http.get<ApiResponse>(`${config.api_url}/users/me?token=${token}`).toPromise();
      }
      console.log(me)

      if (me?.success) {
        const session = JSON.stringify({
          token: token,
          user: me.profile,
        });

        localStorage.setItem('session', btoa(session));
      }

      return me;
    } catch {
      return 
    }
  }

  session(): Session {
    const session = localStorage.getItem('session')

    if (!session) {
      return null;
    }

    return JSON.parse(atob(session))
  }
}
