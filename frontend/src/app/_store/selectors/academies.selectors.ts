import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAcademyReducer from '../reducers/academies.reducer';

export const getAcademyState = createFeatureSelector<fromAcademyReducer.State>('academies');

export const loading = createSelector(
    getAcademyState,
    (state: fromAcademyReducer.State) => state.loading
);

export const getAcademies = createSelector(getAcademyState, (state: fromAcademyReducer.State) => state.academies);
