import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromPlayerReducer from '../reducers/players.reducer';

export const getPlayersState = createFeatureSelector<fromPlayerReducer.State>('players');

export const loading = createSelector(
    getPlayersState,
    (state: fromPlayerReducer.State) => state.loading
);

export const getPlayers = createSelector(getPlayersState, (state: fromPlayerReducer.State) => state.players);
