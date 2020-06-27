import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import config from '../config';
import { Session } from '../models/session.model';

import { ApiResponse } from '../api-response';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http: HttpClient) { }

  async getUser(id: string) {
    try {
      const res = await this.http.get<ApiResponse>(`${config.api_url}/users/${id}`).toPromise();
      return res.profile
    } catch {
      return null;
    }
  }

  async searchUsers(username: string) {
    try {
      const res = await this.http.get<ApiResponse>(`${config.api_url}/users/search?username=${username}`).toPromise();
      return res.users
    } catch {
      return null;
    }
  }

  async getMe() {
    try {
      const session = this.session()
      return session.user
    } catch {
      return [];
    }
  }

  async getUserCode(type: String) {
    try {
      const session = this.session()
      const res = await this.http.get<ApiResponse>(`${config.api_url}/users/code/${type}`).toPromise();
      return res.code || [];
    } catch {
      return [];
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
