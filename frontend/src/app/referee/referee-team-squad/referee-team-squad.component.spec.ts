import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefereeTeamSquadComponent } from './referee-team-squad.component';

describe('RefereeTeamSquadComponent', () => {
  let component: RefereeTeamSquadComponent;
  let fixture: ComponentFixture<RefereeTeamSquadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RefereeTeamSquadComponent]
    });
    fixture = TestBed.createComponent(RefereeTeamSquadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
