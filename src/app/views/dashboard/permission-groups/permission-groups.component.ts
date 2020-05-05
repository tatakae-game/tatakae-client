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

@Component({
  selector: 'app-permission-groups',
  templateUrl: './permission-groups.component.html',
  styleUrls: ['./permission-groups.component.scss']
})
export class PermissionGroupsComponent implements OnInit {

  displayedColumns: string[] = ['name', 'permissions'];
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

  async ngOnInit() {
    await this.getGroups();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.groups.filter = filterValue.trim().toLowerCase();
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
