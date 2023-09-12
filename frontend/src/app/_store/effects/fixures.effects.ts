import { Injectable } from "@angular/core";
import { FixtureService } from "../../_services/fixture.service";
import * as FixturesActions from "../actions/fixures.actions";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, exhaustMap, catchError, mergeMap } from "rxjs/operators";
import { of } from "rxjs";

@Injectable()
export class FixuresEffects {
  constructor(private actions$: Actions, private fixtureService: FixtureService) {}

  loadFixtures$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FixturesActions.loadFixtures),
      map((action: any) => action.payload),
      mergeMap(() => {
        return this.fixtureService.loadFixtures().pipe(
          map((data) =>
            Array.isArray(data) ? FixturesActions.loadFixturesSuccess({ data }) : FixturesActions.loadFixturesSuccess({ data: [] })
          ),
          catchError((error) => of(FixturesActions.loadFixturesFailure({ error })))
        );
      })
    )
  );
}
