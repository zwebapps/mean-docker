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
  selectedCmp: any;
  shortCode: any;
  constructor(private actions$: Actions, private teamService: TeamService, private storageService: StorageService) {
    this.user = this.storageService.getUser();
    this.selectedCmp = this.storageService.getCompetition();
    if (this.selectedCmp) {
      this.shortCode = this.selectedCmp.shortcode;
    } else {
      this.shortCode = this.user?.shortcode || "yfl";
    }
  }

  loadTeams$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamsActions.loadTeams),
      map((action: any) => action.payload),
      mergeMap(() => {
        if (!this.user?.roles.includes("ROLE_SUPERADMIN")) {
          return this.teamService.loadTeamsByCompetition(this.selectedCmp?._id).pipe(
            map((data) => (Array.isArray(data) ? TeamsActions.loadTeamsSuccess({ data }) : TeamsActions.loadTeamsSuccess({ data: [] }))),
            catchError((error) => of(TeamsActions.loadTeamsFailure({ error })))
          );
        } else {
          return this.teamService.loadTeams().pipe(
            map((data) => (Array.isArray(data) ? TeamsActions.loadTeamsSuccess({ data }) : TeamsActions.loadTeamsSuccess({ data: [] }))),
            catchError((error) => of(TeamsActions.loadTeamsFailure({ error })))
          );
        }
      })
    )
  );
}
