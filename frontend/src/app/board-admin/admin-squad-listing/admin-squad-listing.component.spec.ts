import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSquadListingComponent } from './admin-squad-listing.component';

describe('AdminSquadListingComponent', () => {
  let component: AdminSquadListingComponent;
  let fixture: ComponentFixture<AdminSquadListingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminSquadListingComponent]
    });
    fixture = TestBed.createComponent(AdminSquadListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
