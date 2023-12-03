import { createAction, props } from "@ngrx/store";

export const loadCompititions = createAction("[Compititions] Load Compititions");

export const loadCompititionsSuccess = createAction("[Compititions] Load Compititions Success", props<{ data: any }>());

export const loadCompititionsFailure = createAction("[Compititions] Load Compititions Failure", props<{ error: any }>());
