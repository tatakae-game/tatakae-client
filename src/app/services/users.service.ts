import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import config from '../config';

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
}
