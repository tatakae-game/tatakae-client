import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionsGroupDialogComponent } from './permissions-groups-dialog.component';

describe('AddGroupDialogComponent', () => {
  let component: PermissionsGroupDialogComponent;
  let fixture: ComponentFixture<PermissionsGroupDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermissionsGroupDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionsGroupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
