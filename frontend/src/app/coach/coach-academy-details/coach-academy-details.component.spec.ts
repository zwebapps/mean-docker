import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachAcademyDetailsComponent } from './coach-academy-details.component';

describe('CoachAcademyDetailsComponent', () => {
  let component: CoachAcademyDetailsComponent;
  let fixture: ComponentFixture<CoachAcademyDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoachAcademyDetailsComponent]
    });
    fixture = TestBed.createComponent(CoachAcademyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
