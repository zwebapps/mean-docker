import { createAction, props } from '@ngrx/store';

export const loadLeagues = createAction(
  '[Leagues] Load Leagues'
);

export const loadLeaguesSuccess = createAction(
  '[Leagues] Load Leagues Success',
  props<{ data: any }>()
);

export const loadLeaguesFailure = createAction(
  '[Leagues] Load Leagues Failure',
  props<{ error: any }>()
);
