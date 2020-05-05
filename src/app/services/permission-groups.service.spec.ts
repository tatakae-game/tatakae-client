import { TestBed } from '@angular/core/testing';

import { PermissionGroupsService } from './permission-groups.service';

describe('PermissionGroupsService', () => {
  let service: PermissionGroupsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermissionGroupsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
