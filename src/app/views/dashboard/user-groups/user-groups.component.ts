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
  groups: Group[];
  groupsList: string[];
  groupSelector: FormControl;
  usersList: FormGroup[];
  selectedGroups: any[];

  constructor(
    private groupsService: PermissionGroupsService,
    private notifierService: NotifierService,
    private userService: UsersService,
    private formBuilder: FormBuilder
  ) {
  }

  async ngOnInit() {
    const res = await this.groupsService.getAllGroups();
    this.groups = res.groups;
    
  }

  saveGroups(user_id: string, value) {
    console.log(user_id);
    console.log(value);
  }

  async getUsers() {
    try {
      const response = await this.userService.getAllUsers();
      this.users = new MatTableDataSource<User>(response);
      this.users.paginator = this.paginator;
    } catch (error) {
      this.notifierService.notify('error', error.message);
    }
  }

}
