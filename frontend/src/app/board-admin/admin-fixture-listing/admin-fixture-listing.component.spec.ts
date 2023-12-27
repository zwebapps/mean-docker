import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFixtureListingComponent } from './admin-fixture-listing.component';

describe('AdminFixtureListingComponent', () => {
  let component: AdminFixtureListingComponent;
  let fixture: ComponentFixture<AdminFixtureListingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminFixtureListingComponent]
    });
    fixture = TestBed.createComponent(AdminFixtureListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
