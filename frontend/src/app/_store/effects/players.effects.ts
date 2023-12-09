import { Injectable } from "@angular/core";
import { PlayerService } from "../../_services/player.service";
import * as PlayersActions from "../actions/players.actions";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, exhaustMap, catchError, mergeMap } from "rxjs/operators";
import { of } from "rxjs";
import { StorageService } from "src/app/_services/storage.service";

@Injectable()
export class PlayersEffects {
  user: any;
  constructor(private actions$: Actions, private playerService: PlayerService, private storageService: StorageService) {
    this.user = this.storageService.getUser();
  }

  loadPlayers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayersActions.loadPlayers),
      map((action: any) => action.payload),
      mergeMap(() => {
        if (!this.user?.roles.includes("ROLE_SUPERADMIN")) {
          return this.playerService.loadPlayersByShortcode(this.user.shortcode).pipe(
            map((data) =>
              Array.isArray(data) ? PlayersActions.loadPlayersSuccess({ data }) : PlayersActions.loadPlayersSuccess({ data: [] })
            ),
            catchError((error) => of(PlayersActions.loadPlayersFailure({ error })))
          );
        } else {
          return this.playerService.loadPlayers().pipe(
            map((data) =>
              Array.isArray(data) ? PlayersActions.loadPlayersSuccess({ data }) : PlayersActions.loadPlayersSuccess({ data: [] })
            ),
            catchError((error) => of(PlayersActions.loadPlayersFailure({ error })))
          );
        }
      })
    )
  );
}
