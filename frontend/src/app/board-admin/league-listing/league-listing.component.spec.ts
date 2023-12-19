import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeagueListingComponent } from './league-listing.component';

describe('LeagueListingComponent', () => {
  let component: LeagueListingComponent;
  let fixture: ComponentFixture<LeagueListingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeagueListingComponent]
    });
    fixture = TestBed.createComponent(LeagueListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
