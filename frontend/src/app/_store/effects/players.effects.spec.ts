import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { PlayersEffects } from './players.effects';

describe('PlayersEffects', () => {
  let actions$: Observable<any>;
  let effects: PlayersEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PlayersEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(PlayersEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
