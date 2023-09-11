import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { LeaguesEffects } from './leagues.effects';

describe('LeaguesEffects', () => {
  let actions$: Observable<any>;
  let effects: LeaguesEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LeaguesEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(LeaguesEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
