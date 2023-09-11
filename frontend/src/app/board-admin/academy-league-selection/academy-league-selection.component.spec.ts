import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademyLeagueSelectionComponent } from './academy-league-selection.component';

describe('AcademyLeagueSelectionComponent', () => {
  let component: AcademyLeagueSelectionComponent;
  let fixture: ComponentFixture<AcademyLeagueSelectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AcademyLeagueSelectionComponent]
    });
    fixture = TestBed.createComponent(AcademyLeagueSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
