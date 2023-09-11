import { createReducer, on } from '@ngrx/store';
import * as UserActions from '../actions/users.actions';
export const usersFeatureKey = 'users';

export interface State {
  users: any[],
  loading : boolean,
  error: any
}

export const initialState: State = {
  users: [],
  loading : false,
  error: null
};

export const reducer = createReducer(
  initialState,
  on(UserActions.loadUsers, (state) => ({...state,loading: false, error:null})),
  on(UserActions.loadUsersSuccess, (state, { data }) => ({
    ...state,
    users: data,
    loading: true,
    error: null
  })),
  on(UserActions.loadUsersFailure, (state,{error}) => ({...state,loading: false, error})),
);
