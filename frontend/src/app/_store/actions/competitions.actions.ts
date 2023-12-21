import { createAction, props } from "@ngrx/store";

export const loadCompetitions = createAction("[Competitions] Load Competitions");

export const loadCompetitionsSuccess = createAction("[Competitions] Load Competitions Success", props<{ data: any }>());

export const loadCompetitionsFailure = createAction("[Competitions] Load Competitions Failure", props<{ error: any }>());
