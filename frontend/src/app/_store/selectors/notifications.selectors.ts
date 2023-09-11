import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromNotificationReducer from '../reducers/notifications.reducer';

export const getNotificationsState = createFeatureSelector<fromNotificationReducer.State>('notifications');

export const loading = createSelector(getNotificationsState, (state: fromNotificationReducer.State) => state.loading);

export const getNotifications = createSelector(getNotificationsState, (state: fromNotificationReducer.State) => state.notifications);
