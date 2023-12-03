import { Injectable } from "@angular/core";
import { FixtureService } from "../../_services/fixture.service";
import * as FixturesActions from "../actions/fixures.actions";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, exhaustMap, catchError, mergeMap } from "rxjs/operators";
import { of } from "rxjs";
import { StorageService } from "src/app/_services/storage.service";

@Injectable()
export class FixuresEffects {
  user: any;
  constructor(private actions$: Actions, private fixtureService: FixtureService, private storageService: StorageService) {
    this.user = this.storageService.getUser();
  }

  loadFixtures$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FixturesActions.loadFixtures),
      map((action: any) => action.payload),
      mergeMap(() => {
        return this.fixtureService.loadFixturesByCompitition(this.user.compitition).pipe(
          map((data) =>
            Array.isArray(data) ? FixturesActions.loadFixturesSuccess({ data }) : FixturesActions.loadFixturesSuccess({ data: [] })
          ),
          catchError((error) => of(FixturesActions.loadFixturesFailure({ error })))
        );
      })
    )
  );
}
