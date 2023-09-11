import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachDashbaordComponent } from './coach-dashbaord.component';

describe('CoachDashbaordComponent', () => {
  let component: CoachDashbaordComponent;
  let fixture: ComponentFixture<CoachDashbaordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoachDashbaordComponent]
    });
    fixture = TestBed.createComponent(CoachDashbaordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
