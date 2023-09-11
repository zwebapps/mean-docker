import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademyDetailComponent } from './academy-detail.component';

describe('AcademyDetailComponent', () => {
  let component: AcademyDetailComponent;
  let fixture: ComponentFixture<AcademyDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AcademyDetailComponent]
    });
    fixture = TestBed.createComponent(AcademyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
