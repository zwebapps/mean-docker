import { createReducer, on } from '@ngrx/store';
import * as NotificationsActions from '../actions/notification.actions';

export const NotificationsFeatureKey = 'notifications';

export interface State {
  notifications: any[],
  loading : boolean,
  error: any
}

export const initialState: State = {
  notifications: [],
  loading : false,
  error: null
};

export const reducer = createReducer(
  initialState,
  on(NotificationsActions.loadNotificationsSuccess, (state) => ({...state,loading: false, error:null})),
  on(NotificationsActions.loadNotificationsSuccess, (state, { data }) => ({
    ...state,
    notifications: data,
    loading: true,
    error: null
  })),
  on(NotificationsActions.loadNotificationsFailure, (state,{error}) => ({...state,loading: false, error})),
);
