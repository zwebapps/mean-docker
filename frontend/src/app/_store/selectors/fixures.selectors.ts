import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromFixturesReducer from '../reducers/fixtures.reducer';

export const getFixturesState = createFeatureSelector<fromFixturesReducer.State>('fixtures');

export const loading = createSelector(getFixturesState, (state: fromFixturesReducer.State) => state.loading);

export const getFixtures = createSelector(getFixturesState, (state: fromFixturesReducer.State) => state.fixtures);
