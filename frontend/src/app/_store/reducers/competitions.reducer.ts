import { createReducer, on } from "@ngrx/store";
import * as CompetitionsAction from "../actions/competitions.actions";

export const competitionsFeatureKey = "competitions";

export interface State {
  competitions: any[];
  loading: boolean;
  error: any;
}

export const initialState: State = {
  competitions: [],
  loading: false,
  error: null
};

export const reducer = createReducer(
  initialState,
  on(CompetitionsAction.loadCompetitions, (state) => ({ ...state, loading: false, error: null })),
  on(CompetitionsAction.loadCompetitionsSuccess, (state, { data }) => ({
    ...state,
    competitions: data,
    loading: true,
    error: null
  })),
  on(CompetitionsAction.loadCompetitionsFailure, (state, { error }) => ({ ...state, loading: false, error }))
);
