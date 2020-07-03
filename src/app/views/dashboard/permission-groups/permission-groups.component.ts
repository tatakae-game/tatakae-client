import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PermissionGroupsService } from 'src/app/services/permission-groups.service';
import { Group } from 'src/app/models/group.model';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { faPlusSquare, faEdit } from '@fortawesome/free-solid-svg-icons';
import { NotifierService } from 'angular-notifier';
import { MatDialog } from '@angular/material/dialog';
import { PermissionsGroupDialogComponent } from '../../dialogs/permissions-groups-dialog/permissions-groups-dialog.component';
import { Permission } from 'src/app/models/permission.model';

@Component({
  selector: 'app-permission-groups',
  templateUrl: './permission-groups.component.html',
  styleUrls: ['./permission-groups.component.scss']
})
export class PermissionGroupsComponent implements OnInit {

  displayedColumns: string[];
  defaultPermissionsName: string[];
  groups: MatTableDataSource<Group>;

  addIcon = faPlusSquare;
  editIcon = faEdit;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private groupsService: PermissionGroupsService,
    private notifierService: NotifierService,
    public dialog: MatDialog,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.initDisplayedColumns();
    await this.getGroups();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.groups.filter = filterValue.trim().toLowerCase();
  }

  async initDisplayedColumns(): Promise<void> {
    try {
      this.defaultPermissionsName = await this.groupsService.getDefaultPermissionsName();
      if (this.defaultPermissionsName.length) {
        this.displayedColumns = ['name'].concat(this.defaultPermissionsName);
      } else {
        this.notifierService.notify('error', 'Any permission has been set');
      }

    } catch (error) {
      this.notifierService.notify('error', error.message);
    }
  }

  getPermissionValueByName(name: string, permissions: Permission[]): Permission {
    return permissions.find(p => p.name.toLowerCase() === name)
  }

  async getGroups() {
    try {
      const response = await this.groupsService.getAllGroups();
      this.groups = new MatTableDataSource<Group>(response.groups);
      this.groups.sort = this.sort;
      this.groups.paginator = this.paginator;
    } catch (error) {
      this.notifierService.notify('error', error.message);
    }
  }

  async updateGroup(group: Group) {
    try {
      await this.groupsService.updateGroup(group);
    } catch (error) {
      this.notifierService.notify('error', error.message);
    }
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(PermissionsGroupDialogComponent, {
      width: '250px',
      data: { title: 'Add', name: '' }
    });

    dialogRef.afterClosed().subscribe(async (data: string) => {
      if (data !== undefined && data !== '') {
        try {
          await this.groupsService.addGroup(data);
          await this.getGroups();
          this.groups.paginator.lastPage();

        } catch (error) {
          this.notifierService.notify('error', error.message);
        }
      }
    });
  }

  openEditDialog(group: Group): void {
    const dialogRef = this.dialog.open(PermissionsGroupDialogComponent, {
      width: '250px',
      data: { title: 'Update', name: group.name }
    });

    dialogRef.afterClosed().subscribe(async (data: string) => {
      if (data !== undefined && data !== '') {
        try {
          if (group.name !== data) {
            group.name = data;
            await this.groupsService.updateGroup(group);
            await this.getGroups();
          }

        } catch (error) {
          this.notifierService.notify('error', error.message);
        }
      }
    });
  }

}
