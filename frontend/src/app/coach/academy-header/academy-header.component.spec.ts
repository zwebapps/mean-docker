import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademyHeaderComponent } from './academy-header.component';

describe('AcademyHeaderComponent', () => {
  let component: AcademyHeaderComponent;
  let fixture: ComponentFixture<AcademyHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AcademyHeaderComponent]
    });
    fixture = TestBed.createComponent(AcademyHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
