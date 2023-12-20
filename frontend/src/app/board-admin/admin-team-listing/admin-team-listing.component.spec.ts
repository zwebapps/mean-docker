import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTeamListingComponent } from './admin-team-listing.component';

describe('AdminTeamListingComponent', () => {
  let component: AdminTeamListingComponent;
  let fixture: ComponentFixture<AdminTeamListingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminTeamListingComponent]
    });
    fixture = TestBed.createComponent(AdminTeamListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
