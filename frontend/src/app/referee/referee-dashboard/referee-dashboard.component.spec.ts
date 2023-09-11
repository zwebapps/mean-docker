import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefereeDashboardComponent } from './referee-dashboard.component';

describe('RefereeDashboardComponent', () => {
  let component: RefereeDashboardComponent;
  let fixture: ComponentFixture<RefereeDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RefereeDashboardComponent]
    });
    fixture = TestBed.createComponent(RefereeDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
