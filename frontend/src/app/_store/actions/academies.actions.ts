import { createAction, props } from '@ngrx/store';

export const loadAcademies = createAction(
  '[Academies] Load Academies'
);

export const loadAcademiesSuccess = createAction(
  '[Academies] Load Academies Success',
  props<{ data: any }>()
);

export const loadAcademiesFailure = createAction(
  '[Academies] Load Academies Failure',
  props<{ error: any }>()
);
