import { Injectable } from "@angular/core";
import { TeamService } from "../../_services/team.service";
import * as TeamsActions from "../actions/teams.actions";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, exhaustMap, catchError, mergeMap } from "rxjs/operators";
import { of } from "rxjs";
import { UserService } from "src/app/_services/user.service";
import { StorageService } from "src/app/_services/storage.service";

@Injectable()
export class TeamsEffects {
  user: any;
  constructor(private actions$: Actions, private teamService: TeamService, private storageService: StorageService) {
    this.user = this.storageService.getUser();
  }

  loadTeams$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamsActions.loadTeams),
      map((action: any) => action.payload),
      mergeMap(() => {
        return this.teamService.loadTeamsByCompitition(this.user.compitition).pipe(
          map((data) => (Array.isArray(data) ? TeamsActions.loadTeamsSuccess({ data }) : TeamsActions.loadTeamsSuccess({ data: [] }))),
          catchError((error) => of(TeamsActions.loadTeamsFailure({ error })))
        );
      })
    )
  );
}
