import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademyListingComponent } from './academy-listing.component';

describe('AcademyListingComponent', () => {
  let component: AcademyListingComponent;
  let fixture: ComponentFixture<AcademyListingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AcademyListingComponent]
    });
    fixture = TestBed.createComponent(AcademyListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
