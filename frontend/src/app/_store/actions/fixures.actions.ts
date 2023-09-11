import { createAction, props } from '@ngrx/store';

export const loadFixtures = createAction(
  '[Fixtures] Load Fixtures'
);

export const loadFixturesSuccess = createAction(
  '[Fixtures] Load Fixtures Success',
  props<{ data: any }>()
);

export const loadFixturesFailure = createAction(
  '[Fixtures] Load Fixtures Failure',
  props<{ error: any }>()
);
