import { createReducer, on } from '@ngrx/store';
import * as LeaguesActions from '../actions/leagues.actions';

export const leaguesFeatureKey = 'leagues';

export interface State {
  leagues: any[],
  loading : boolean,
  error: any
}

export const initialState: State = {
  leagues: [],
  loading : false,
  error: null
};

export const reducer = createReducer(
  initialState,
  on(LeaguesActions.loadLeaguesSuccess, (state) => ({...state,loading: false, error:null})),
  on(LeaguesActions.loadLeaguesSuccess, (state, { data }) => ({
    ...state,
    leagues: data,
    loading: true,
    error: null
  })),
  on(LeaguesActions.loadLeaguesFailure, (state,{error}) => ({...state,loading: false, error})),
);
