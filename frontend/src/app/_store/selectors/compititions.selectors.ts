import { createFeatureSelector, createSelector } from "@ngrx/store";

import * as fromCompititionReducer from "../reducers/compititions.reducer";

export const getCompititionState = createFeatureSelector<fromCompititionReducer.State>("compititions");

export const loading = createSelector(getCompititionState, (state: fromCompititionReducer.State) => state.loading);

export const getCompititions = createSelector(getCompititionState, (state: fromCompititionReducer.State) => state.compititions);
