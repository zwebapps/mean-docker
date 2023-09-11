import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSquadListComponent } from './admin-squad-list.component';

describe('AdminSquadListComponent', () => {
  let component: AdminSquadListComponent;
  let fixture: ComponentFixture<AdminSquadListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminSquadListComponent]
    });
    fixture = TestBed.createComponent(AdminSquadListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
