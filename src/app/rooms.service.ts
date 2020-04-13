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
      return await this.http.post<ApiResponse>(`${config.api_url}/chat/rooms/${id}/invite`, {
        user: user_id,
      }).toPromise();

    } catch {
      throw new Error('An error occured.');
    }
  }

  async createRoom(name: string, guest_id: string) {
    try {
      return await this.http.post<ApiResponse>(`${config.api_url}/chat/rooms`, {
        name,
        guest: guest_id,
      }).toPromise();

    } catch {
      throw new Error('An error occured.');
    }
  }

  async createTicket(name: string) {
    try {
      return await this.http.post<ApiResponse>(`${config.api_url}/chat/rooms`, {
        name,
        is_ticket: true,
      }).toPromise();

    } catch {
      throw new Error('An error occured.');
    }
  }

  async closeTicket(id: string) {
    try {
      await this.http.put<ApiResponse>(`${config.api_url}/support/tickets/${id}/close`, {}).toPromise();

      return true;
    } catch {
      throw new Error('An error occured.');
    }
  }

  async getTickets() {
    try {
      const res = await this.http.get<ApiResponse>(`${config.api_url}/support/tickets`).toPromise();
      return res?.rooms || [];
    } catch {
      return [];
    }
  }

  async assignedTo(ticket_id: string, user_id: string) {
    try {
      await this.http.put<ApiResponse>(`${config.api_url}/support/tickets/${ticket_id}/assign`, {
        user: user_id,
      }).toPromise()

      return true;
    } catch {
      throw new Error('An error occured.');
    }
  }
}
