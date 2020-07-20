import { Component, OnInit, ViewChild } from '@angular/core';
import { PermissionGroupsService } from 'src/app/services/permission-groups.service';
import { NotifierService } from 'angular-notifier';
import { UsersService } from 'src/app/services/users.service';
import { User } from 'src/app/models/user.model';
import { Group } from 'src/app/models/group.model';
import { FormControl, NgModel, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-user-groups',
  templateUrl: './user-groups.component.html',
  styleUrls: ['./user-groups.component.scss']
})
export class UserGroupsComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  users: MatTableDataSource<User>;
  displayedColumns: string[];
  groups: Group[];
  groupsName: string[];
  selectedGroups: any[];

  constructor(
    private groupsService: PermissionGroupsService,
    private notifierService: NotifierService,
    private userService: UsersService,
    private formBuilder: FormBuilder
  ) {
  }

  async ngOnInit() {
    await this.initDisplayedColumns();
    await this.getUsers();
  }

  async initDisplayedColumns(): Promise<void> {
    try {
      this.groups = (await this.groupsService.getAllGroups()).groups;
      this.groupsName = this.groups.map(group => group.name.toLowerCase())
      console.log(this.groupsName)
      if (this.groupsName.length) {
        this.displayedColumns = ['user'].concat(this.groupsName);
        console.log(this.displayedColumns)
      } else {
        this.notifierService.notify('error', 'Any permission has been set');
      }

    } catch (error) {
      this.notifierService.notify('error', error.message);
    }
  }

  async getUsers() {
    try {
      const response = await this.userService.getAllUsers();
      this.users = new MatTableDataSource<User>(response);
      console.log(this.users);
      this.users.paginator = this.paginator;
    } catch (error) {
      this.notifierService.notify('error', error.message);
    }
  }

  async updateGroup(user: User, group: string) {
    try {
      const groups = user.groups
      const groupId = this.getGroupByName(group)._id;
      if (groups.includes(groupId)) {
        groups.splice(groups.indexOf(groupId), 1);
      } else {
        groups.push(groupId)
      }
      
      const res = await this.userService.updateUserGroups(groups, user.id);
      console.log(res);
    } catch (e) {
      console.log(e)
    }

  }

  getCheckedValue(groupId: string, user: User) {
    return user.groups.includes(groupId);
  }

  getGroupByName(groupName: string) {
    return this.groups.find(group => group.name.toLowerCase() === groupName)
  }

  getUserGroupByName(groupName: string, user: User) {
    return {
      groupName,
      checked: this.getCheckedValue(this.getGroupByName(groupName)._id, user),
    }
  }

}
