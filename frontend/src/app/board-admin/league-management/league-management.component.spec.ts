import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeagueManagementComponent } from './league-management.component';

describe('LeagueManagementComponent', () => {
  let component: LeagueManagementComponent;
  let fixture: ComponentFixture<LeagueManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeagueManagementComponent]
    });
    fixture = TestBed.createComponent(LeagueManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
