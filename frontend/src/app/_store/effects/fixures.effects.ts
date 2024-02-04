import { Injectable } from "@angular/core";
import { FixtureService } from "../../_services/fixture.service";
import * as FixturesActions from "../actions/fixures.actions";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, catchError, mergeMap } from "rxjs/operators";
import { of } from "rxjs";
import { StorageService } from "src/app/_services/storage.service";

@Injectable()
export class FixuresEffects {
  user: any;
  selectedCmp: any;
  shortCode: any;
  constructor(private actions$: Actions, private fixtureService: FixtureService, private storageService: StorageService) {
    this.user = this.storageService.getUser();
    this.selectedCmp = this.storageService.getCompetition();
    if (this.selectedCmp) {
      this.shortCode = this.selectedCmp.shortcode;
    } else {
      this.shortCode = this.user?.shortcode || "yfl";
    }
  }

  loadFixtures$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FixturesActions.loadFixtures),
      map((action: any) => action.payload),
      mergeMap(() => {
        if (!this.user?.roles.includes("ROLE_SUPERADMIN")) {
          return this.fixtureService.loadFixturesByCompetition(this.selectedCmp?._id).pipe(
            map((data) =>
              Array.isArray(data) ? FixturesActions.loadFixturesSuccess({ data }) : FixturesActions.loadFixturesSuccess({ data: [] })
            ),
            catchError((error) => of(FixturesActions.loadFixturesFailure({ error })))
          );
        } else {
          return this.fixtureService.loadFixtures().pipe(
            map((data) =>
              Array.isArray(data) ? FixturesActions.loadFixturesSuccess({ data }) : FixturesActions.loadFixturesSuccess({ data: [] })
            ),
            catchError((error) => of(FixturesActions.loadFixturesFailure({ error })))
          );
        }
      })
    )
  );
}
