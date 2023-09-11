import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromTeamReducer from '../reducers/teams.reducer';

export const getTeamsState = createFeatureSelector<fromTeamReducer.State>('teams');

export const loading = createSelector(
  getTeamsState,
    (state: fromTeamReducer.State) => state.loading
);

export const getTeams = createSelector(getTeamsState, (state: fromTeamReducer.State) => state.teams);
