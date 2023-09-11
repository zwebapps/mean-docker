import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { AcademiesEffects } from './academies.effects';

describe('AcademiesEffects', () => {
  let actions$: Observable<any>;
  let effects: AcademiesEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AcademiesEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(AcademiesEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
