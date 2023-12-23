import { Injectable } from "@angular/core";
import { AcademyService } from "../../_services/academy.service";
import * as AcademiesActions from "../actions/academies.actions";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, exhaustMap, catchError, mergeMap } from "rxjs/operators";
import { of } from "rxjs";
import { StorageService } from "src/app/_services/storage.service";

@Injectable()
export class AcademiesEffects {
  user: any;
  selectedCmp: any;
  shortCode: any;
  constructor(private actions$: Actions, private academyService: AcademyService, private storageService: StorageService) {
    this.user = this.storageService.getUser();
    this.selectedCmp = this.storageService.getCompetition();
    if (this.selectedCmp) {
      this.shortCode = this.selectedCmp.shortcode;
    } else {
      this.shortCode = this.user?.shortcode || "yfl";
    }
  }

  loadAcademies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AcademiesActions.loadAcademies),
      map((action: any) => action.payload),
      mergeMap(() => {
        if (!this.user?.roles.includes("ROLE_SUPERADMIN")) {
          return this.academyService.loadAcademiesByShortCode(this.user.shortcode).pipe(
            map((data) =>
              Array.isArray(data) ? AcademiesActions.loadAcademiesSuccess({ data }) : AcademiesActions.loadAcademiesSuccess({ data: [] })
            ),
            catchError((error) => of(AcademiesActions.loadAcademiesFailure({ error })))
          );
        } else {
          return this.academyService.loadAcademies().pipe(
            map((data) =>
              Array.isArray(data) ? AcademiesActions.loadAcademiesSuccess({ data }) : AcademiesActions.loadAcademiesSuccess({ data: [] })
            ),
            catchError((error) => of(AcademiesActions.loadAcademiesFailure({ error })))
          );
        }
      })
    )
  );
}
