import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachSquadListComponent } from './coach-squad-list.component';

describe('CoachSquadListComponent', () => {
  let component: CoachSquadListComponent;
  let fixture: ComponentFixture<CoachSquadListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoachSquadListComponent]
    });
    fixture = TestBed.createComponent(CoachSquadListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
