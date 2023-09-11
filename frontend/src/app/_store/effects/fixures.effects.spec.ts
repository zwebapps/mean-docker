import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { FixuresEffects } from './fixures.effects';

describe('FixuresEffects', () => {
  let actions$: Observable<any>;
  let effects: FixuresEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FixuresEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(FixuresEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
