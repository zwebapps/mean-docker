import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCompetitionComponent } from './admin-competition.component';

describe('AdminCompetitionComponent', () => {
  let component: AdminCompetitionComponent;
  let fixture: ComponentFixture<AdminCompetitionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminCompetitionComponent]
    });
    fixture = TestBed.createComponent(AdminCompetitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
