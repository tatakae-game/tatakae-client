import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import config from '../config';
import { Session } from '../models/session.model';

import { ApiResponse } from '../api-response';
import { CodeFile } from '../models/code_file.model';
import { User } from '../models/user.model';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http: HttpClient, private authService: AuthService) { }

  async getUser(id: string) {
    try {
      const res = await this.http.get<ApiResponse>(`${config.api_url}/users/${id}`).toPromise();
      return res.profile
    } catch {
      return null;
    }
  }

  async getAdministrators() {
    try {
      const res = await this.http.get<ApiResponse>(`${config.api_url}/users/admins`).toPromise();
      return res.users
    } catch {
      return null;
    }
  }

  async isAdmin(): Promise<boolean> {
    const me = await this.getMe();
    const admins = await this.getAdministrators();

    if (admins === null) {
      return false;
    }

    let isAdmin = false;

    for (const admin of admins) {
      if (admin.username === me.username) {
        isAdmin = true;
        break;
      }
    }
    return isAdmin;
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

  async saveCode(files: CodeFile[], language: string): Promise<ApiResponse> {
    const session = this.session();
    const res = await this.http.put<ApiResponse>(`${config.api_url}/users/${session.user.id}/code`, { files, language }).toPromise();
    return res;
  }

  async update_user_language(language: string) {
    try {
      const res = await this.http.put<ApiResponse>(`${config.api_url}/user/language`, {
        language,
      }).toPromise();
      this.authService.lazy_load_session(this.session().token)

    } catch {
      return 'an error occured';
    }
  }

  async update_password(password: string, newPassword: string) {
    try {
      console.log('popo' + password, newPassword)
      const res = await this.http.put<ApiResponse>(`${config.api_url}/user/password`, {
        password,
        new_password: newPassword,
      }).toPromise();
      console.log(res)

    } catch {
      return 'an error occured';
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
