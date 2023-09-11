import { createAction, props } from '@ngrx/store';

export const loadTeams = createAction(
  '[Teams] Load Teams'
);

export const loadTeamsSuccess = createAction(
  '[Teams] Load Teams Success',
  props<{ data: any }>()
);

export const loadTeamsFailure = createAction(
  '[Teams] Load Teams Failure',
  props<{ error: any }>()
);
