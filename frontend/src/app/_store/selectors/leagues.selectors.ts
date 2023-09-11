import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromLeagueReducer from '../reducers/leagues.reducer';

export const getLeaguesState = createFeatureSelector<fromLeagueReducer.State>('leagues');

export const loading = createSelector(getLeaguesState, (state: fromLeagueReducer.State) => state.loading);

export const getLeagues = createSelector(getLeaguesState, (state: fromLeagueReducer.State) => state.leagues);
