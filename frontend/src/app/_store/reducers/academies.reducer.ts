import { createReducer, on } from '@ngrx/store';
import * as AcademiesActions from '../actions/academies.actions';

export const academiesFeatureKey = 'academies';

export interface State {
  academies: any[],
  loading : boolean,
  error: any
}

export const initialState: State = {
  academies: [],
  loading : false,
  error: null
};

export const reducer = createReducer(
  initialState,
  on(AcademiesActions.loadAcademies, (state) => ({...state,loading: false, error:null})),
  on(AcademiesActions.loadAcademiesSuccess, (state, { data }) => ({
    ...state,
    academies : data,
    loading: true,
    error: null
  })),
  on(AcademiesActions.loadAcademiesFailure, (state,{error}) => ({...state,loading: false, error})),
);
