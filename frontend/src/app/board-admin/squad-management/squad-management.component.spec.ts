import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SquadManagementComponent } from './squad-management.component';

describe('SquadManagementComponent', () => {
  let component: SquadManagementComponent;
  let fixture: ComponentFixture<SquadManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SquadManagementComponent]
    });
    fixture = TestBed.createComponent(SquadManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
