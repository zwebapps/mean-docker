import { createFeatureSelector, createSelector } from "@ngrx/store";

import * as fromCompetitionReducer from "../reducers/competitions.reducer";

export const getCompetitionState = createFeatureSelector<fromCompetitionReducer.State>("competitions");

export const loading = createSelector(getCompetitionState, (state: fromCompetitionReducer.State) => state.loading);

export const getCompetitions = createSelector(getCompetitionState, (state: fromCompetitionReducer.State) => state.competitions);
