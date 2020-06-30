import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import config from '../config';
import { Session } from '../models/session.model';

import { ApiResponse } from '../api-response';
import { CodeFile } from '../models/code_file.model';
import { User } from '../models/user.model';

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

  async getMe(): Promise<any> {
    try {
      const session = this.session()
      return session.user

    } catch {
      return [];
    }
  }

  async getRunningLanguage(): Promise<any> {
    try {
      const session = this.session()
      return session.user.running_language

    } catch {
      return [];
    }
  }

  async getUserCode(type: String) {
    const cached_code = localStorage.getItem(`${type}_code`)
    
    if (cached_code) {
      return JSON.parse(atob(cached_code))
    }

    try {
      const session = this.session()
      const res = await this.http.get<ApiResponse>(`${config.api_url}/users/code/${type}`).toPromise();
      localStorage.setItem(`${type}_code`, btoa(JSON.stringify(res.code)))
      return res.code || [];

    } catch {
      return [];
    }
  }

  async saveCode(files: CodeFile[], language: string) {

    try {
      const session = this.session()
      const res = await this.http.put<ApiResponse>(`${config.api_url}/users/${session.user.id}/code`, { files, language }).toPromise();
      return res.success

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
