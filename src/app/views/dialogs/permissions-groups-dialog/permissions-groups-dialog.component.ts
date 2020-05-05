import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-group-dialog',
  templateUrl: './permissions-groups-dialog.component.html',
  styleUrls: ['./permissions-groups-dialog.component.scss']
})
export class PermissionsGroupDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<PermissionsGroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, name: string }) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}