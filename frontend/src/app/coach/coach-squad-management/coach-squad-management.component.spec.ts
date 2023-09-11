import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachSquadManagementComponent } from './coach-squad-management.component';

describe('CoachSquadManagementComponent', () => {
  let component: CoachSquadManagementComponent;
  let fixture: ComponentFixture<CoachSquadManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoachSquadManagementComponent]
    });
    fixture = TestBed.createComponent(CoachSquadManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
