import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SquadAcademyListComponent } from './squad-academy-list.component';

describe('SquadAcademyListComponent', () => {
  let component: SquadAcademyListComponent;
  let fixture: ComponentFixture<SquadAcademyListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SquadAcademyListComponent]
    });
    fixture = TestBed.createComponent(SquadAcademyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
