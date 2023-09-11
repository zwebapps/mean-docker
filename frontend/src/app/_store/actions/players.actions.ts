import { createAction, props } from '@ngrx/store';

export const loadPlayers = createAction(
  '[Players] Load Players'
);

export const loadPlayersSuccess = createAction(
  '[Players] Load Players Success',
  props<{ data: any }>()
);

export const loadPlayersFailure = createAction(
  '[Players] Load Players Failure',
  props<{ error: any }>()
);
