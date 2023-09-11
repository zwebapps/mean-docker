import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { TeamsEffects } from './teams.effects';

describe('TeamsEffects', () => {
  let actions$: Observable<any>;
  let effects: TeamsEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TeamsEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(TeamsEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
