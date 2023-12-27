import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFixtureResultsComponent } from './admin-fixture-results.component';

describe('AdminFixtureResultsComponent', () => {
  let component: AdminFixtureResultsComponent;
  let fixture: ComponentFixture<AdminFixtureResultsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminFixtureResultsComponent]
    });
    fixture = TestBed.createComponent(AdminFixtureResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
