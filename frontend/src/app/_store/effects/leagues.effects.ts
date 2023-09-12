import { Injectable } from "@angular/core";
import { LeagueService } from "../../_services/league.service";
import * as LeagueActions from "../actions/leagues.actions";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, catchError, mergeMap } from "rxjs/operators";
import { of } from "rxjs";

@Injectable()
export class LeaguesEffects {
  constructor(private actions$: Actions, private leagueService: LeagueService) {}

  loadPlayers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeagueActions.loadLeagues),
      map((action: any) => action.payload),
      mergeMap(() => {
        return this.leagueService.loadLeagues().pipe(
          map((data) =>
            Array.isArray(data) ? LeagueActions.loadLeaguesSuccess({ data }) : LeagueActions.loadLeaguesSuccess({ data: [] })
          ),
          catchError((error) => of(LeagueActions.loadLeaguesFailure({ error })))
        );
      })
    )
  );
}
