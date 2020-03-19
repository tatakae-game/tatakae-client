import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiResponse } from './api-response';

import config from './config';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {

  constructor(
    private http: HttpClient,
  ) { }

  async getRooms() {
    try {
      const res = await this.http.get<ApiResponse>(`${config.api_url}/chat/rooms`).toPromise();
      return res?.rooms || [];
    } catch {
      return [];
    }
  }

  async getRoom(id: string) {
    try {
      const res = await this.http.get<ApiResponse>(`${config.api_url}/chat/rooms/${id}`).toPromise();
      return res.room;
    } catch {
      return null;
    }
  }

  async getUsersInRoom(id: string) {
    try {
      const res = await this.http.get<ApiResponse>(`${config.api_url}/chat/rooms/${id}/users`).toPromise();
      return res.users || [];
    } catch {
      return [];
    }
  }

  async addUser(id: string, user_id: string) {
    try {
      await this.http.post<ApiResponse>(`${config.api_url}/chat/rooms/${id}/invite`, {
        user: user_id,
      }).toPromise();

      return true;
    } catch {
      return false;
    }
  }
}
