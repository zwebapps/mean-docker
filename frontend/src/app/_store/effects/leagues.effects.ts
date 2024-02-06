import { Injectable } from "@angular/core";
import { LeagueService } from "../../_services/league.service";
import * as LeagueActions from "../actions/leagues.actions";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, catchError, mergeMap } from "rxjs/operators";
import { of } from "rxjs";
import { StorageService } from "src/app/_services/storage.service";

@Injectable()
export class LeaguesEffects {
  user: any;
  selectedCmp: any;
  shortCode: any;
  constructor(private actions$: Actions, private leagueService: LeagueService, private storageService: StorageService) {
    this.user = this.storageService.getUser();
    this.selectedCmp = this.storageService.getCompetition();
    if (this.selectedCmp) {
      this.shortCode = this.selectedCmp.shortcode;
    } else {
      this.shortCode = this.user?.shortcode || "yfl";
    }
  }

  loadPlayers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeagueActions.loadLeagues),
      map((action: any) => action.payload),
      mergeMap(() => {
        if (this.user?.roles.includes("ROLE_SUPERADMIN")) {
          return this.leagueService.loadLeagues().pipe(
            map((data) =>
              Array.isArray(data) ? LeagueActions.loadLeaguesSuccess({ data }) : LeagueActions.loadLeaguesSuccess({ data: [] })
            ),
            catchError((error) => of(LeagueActions.loadLeaguesFailure({ error })))
          );
        } else if (this.user?.roles.includes("ROLE_REFEREE")) {
          return this.leagueService.loadLeaguesByShortcode(this.user.shortcode).pipe(
            map((data) =>
              Array.isArray(data) ? LeagueActions.loadLeaguesSuccess({ data }) : LeagueActions.loadLeaguesSuccess({ data: [] })
            ),
            catchError((error) => of(LeagueActions.loadLeaguesFailure({ error })))
          );
        } else {
          return this.leagueService.loadLeaguesByCompetition(this.selectedCmp?._id).pipe(
            map((data) =>
              Array.isArray(data) ? LeagueActions.loadLeaguesSuccess({ data }) : LeagueActions.loadLeaguesSuccess({ data: [] })
            ),
            catchError((error) => of(LeagueActions.loadLeaguesFailure({ error })))
          );
        }
      })
    )
  );
}
