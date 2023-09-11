import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDataTableComponent } from './admin-data-table.component';

describe('AdminDataTableComponent', () => {
  let component: AdminDataTableComponent;
  let fixture: ComponentFixture<AdminDataTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminDataTableComponent]
    });
    fixture = TestBed.createComponent(AdminDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
