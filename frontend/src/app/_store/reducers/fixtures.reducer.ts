import { createReducer, on } from '@ngrx/store';
import * as FixuresActions from '../actions/fixures.actions';

export const fixuresFeatureKey = 'fixures';


export interface State {
  fixtures: any[],
  loading : boolean,
  error: any
}

export const initialState: State = {
  fixtures: [],
  loading : false,
  error: null
};

export const reducer = createReducer(
  initialState,
  on(FixuresActions.loadFixtures, (state) => ({...state,loading: false, error:null})),
  on(FixuresActions.loadFixturesSuccess, (state, { data }) => ({
    ...state,
    fixtures : data,
    loading: true,
    error: null
  })),
  on(FixuresActions.loadFixturesFailure, (state,{error}) => ({...state,loading: false, error})),
);
