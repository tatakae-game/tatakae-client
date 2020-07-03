import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import config from '../config';

import { ApiResponse } from '../api-response';
import { Group } from '../models/group.model';

@Injectable({
  providedIn: 'root'
})
export class PermissionGroupsService {

  constructor(private http: HttpClient) { }

  async getAllGroups() {
    try {
      return await this.http.get<ApiResponse>(`${config.api_url}/groups`).toPromise();
    } catch (error) {
      throw new Error('An error occured.');
    }
  }

  async addGroup(name: string) {
    try {
      return await this.http.post<ApiResponse>(`${config.api_url}/groups`, {
        name,
      }).toPromise();

    } catch (error) {
      throw new Error(`An error occured while creating the new permission group.`);
    }
  }

  async updateGroup(group: Group) {
    try {
      return await this.http.put<ApiResponse>(`${config.api_url}/groups/${group._id}`, {
        name: group.name,
        permissions: group.permissions
      }).toPromise();
    } catch (error) {
      throw new Error(`An error occured while updating ${group.name}.`);
    }
  }

  async getDefaultPermissionsName(): Promise<string[]> {
    try {
      const res = await this.http.get<ApiResponse>(`${config.api_url}/permissions`).toPromise();

      if (res?.success) {
        return res.permissions.map(p => p.name.toLocaleLowerCase());
      } else {
        return [];
      }
    } catch (error) {
      throw new Error(error.message);
      
    }
  }

}
