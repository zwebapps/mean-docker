import { createReducer, on } from '@ngrx/store';
export const playersFeatureKey = 'players';
import * as PlayersActions from '../actions/players.actions';

export interface State {
  players: any[],
  loading : boolean,
  error: any
}

export const initialState: State = {
  players: [],
  loading : false,
  error: null
};

export const reducer = createReducer(
  initialState,
  on(PlayersActions.loadPlayersSuccess, (state) => ({...state,loading: false, error:null})),
  on(PlayersActions.loadPlayersSuccess, (state, { data }) => ({
    ...state,
    players: data,
    loading: true,
    error: null
  })),
  on(PlayersActions.loadPlayersFailure, (state,{error}) => ({...state,loading: false, error})),
);


