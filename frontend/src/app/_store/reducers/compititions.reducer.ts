import { createReducer, on } from "@ngrx/store";
import * as CompititionsAction from "../actions/compititions.actions";

export const compititionsFeatureKey = "compititions";

export interface State {
  compititions: any[];
  loading: boolean;
  error: any;
}

export const initialState: State = {
  compititions: [],
  loading: false,
  error: null
};

export const reducer = createReducer(
  initialState,
  on(CompititionsAction.loadCompititions, (state) => ({ ...state, loading: false, error: null })),
  on(CompititionsAction.loadCompititionsSuccess, (state, { data }) => ({
    ...state,
    compititions: data,
    loading: true,
    error: null
  })),
  on(CompititionsAction.loadCompititionsFailure, (state, { error }) => ({ ...state, loading: false, error }))
);
