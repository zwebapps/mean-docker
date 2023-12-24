import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAcademyTeamsComponent } from './admin-academy-teams.component';

describe('AdminAcademyTeamsComponent', () => {
  let component: AdminAcademyTeamsComponent;
  let fixture: ComponentFixture<AdminAcademyTeamsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminAcademyTeamsComponent]
    });
    fixture = TestBed.createComponent(AdminAcademyTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
