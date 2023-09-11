import { createAction, props } from '@ngrx/store';

export const loadNotifications = createAction(
  '[Notifications] Load Notifications'
);

export const loadNotificationsSuccess = createAction(
  '[Notifications] Load Notifications Success',
  props<{ data: any }>()
);

export const loadNotificationsFailure = createAction(
  '[Notifications] Load Notifications Failure',
  props<{ error: any }>()
);
