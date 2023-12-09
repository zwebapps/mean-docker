import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTopFiltersComponent } from './admin-top-filters.component';

describe('AdminTopFiltersComponent', () => {
  let component: AdminTopFiltersComponent;
  let fixture: ComponentFixture<AdminTopFiltersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminTopFiltersComponent]
    });
    fixture = TestBed.createComponent(AdminTopFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
