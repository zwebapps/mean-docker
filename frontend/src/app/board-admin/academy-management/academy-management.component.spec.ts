import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademyManagementComponent } from './academy-management.component';

describe('AcademyManagementComponent', () => {
  let component: AcademyManagementComponent;
  let fixture: ComponentFixture<AcademyManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AcademyManagementComponent]
    });
    fixture = TestBed.createComponent(AcademyManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
