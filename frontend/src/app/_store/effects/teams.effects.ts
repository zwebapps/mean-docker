import { Injectable } from "@angular/core";
import { TeamService } from "../../_services/team.service";
import * as TeamsActions from "../actions/teams.actions";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, exhaustMap, catchError, mergeMap } from "rxjs/operators";
import { of } from "rxjs";

@Injectable()
export class TeamsEffects {
  constructor(private actions$: Actions, private teamService: TeamService) {}

  loadTeams$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamsActions.loadTeams),
      map((action: any) => action.payload),
      mergeMap(() => {
        return this.teamService.loadTeams().pipe(
          map((data) => (Array.isArray(data) ? TeamsActions.loadTeamsSuccess({ data }) : TeamsActions.loadTeamsSuccess({ data: [] }))),
          catchError((error) => of(TeamsActions.loadTeamsFailure({ error })))
        );
      })
    )
  );
}
