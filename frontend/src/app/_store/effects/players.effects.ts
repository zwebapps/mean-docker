import { Injectable } from '@angular/core';
import { PlayerService } from '../../_services/player.service';
import * as PlayersActions from '../actions/players.actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, exhaustMap, catchError, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class PlayersEffects {
  constructor(private actions$: Actions, private playerService:PlayerService) {}

  loadPlayers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayersActions.loadPlayers),
      map((action: any) => action.payload),
      mergeMap(() => {
        return this.playerService.loadPlayers().pipe(map(data => PlayersActions.loadPlayersSuccess({ data })),
          catchError(error => of(PlayersActions.loadPlayersFailure({ error })))
        );
      })
    )
  )
}
