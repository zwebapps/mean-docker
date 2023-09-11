import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefereeSquadListingComponent } from './referee-squad-listing.component';

describe('RefereeSquadListingComponent', () => {
  let component: RefereeSquadListingComponent;
  let fixture: ComponentFixture<RefereeSquadListingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RefereeSquadListingComponent]
    });
    fixture = TestBed.createComponent(RefereeSquadListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
