import { createReducer, on } from '@ngrx/store';
import * as TeamsActions from '../actions/teams.actions';

export const teamsFeatureKey = 'teams';

export interface State {
  teams: any[],
  loading : boolean,
  error: any
}

export const initialState: State = {
  teams: [],
  loading : false,
  error: null

};

export const reducer = createReducer(
  initialState,
  on(TeamsActions.loadTeamsSuccess, (state) => ({...state,loading: false, error:null})),
  on(TeamsActions.loadTeamsSuccess, (state, { data }) => ({
    ...state,
    teams: data,
    loading: true,
    error: null
  })),
  on(TeamsActions.loadTeamsFailure, (state,{error}) => ({...state,loading: false, error})),
);

