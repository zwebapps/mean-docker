import { Injectable } from "@angular/core";
import { AcademyService } from "../../_services/academy.service";
import * as AcademiesActions from "../actions/academies.actions";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, exhaustMap, catchError, mergeMap } from "rxjs/operators";
import { of } from "rxjs";

@Injectable()
export class AcademiesEffects {
  constructor(private actions$: Actions, private academyService: AcademyService) {}

  loadAcademies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AcademiesActions.loadAcademies),
      map((action: any) => action.payload),
      mergeMap(() => {
        return this.academyService.loadAcademies().pipe(
          map((data) =>
            Array.isArray(data) ? AcademiesActions.loadAcademiesSuccess({ data }) : AcademiesActions.loadAcademiesSuccess({ data: [] })
          ),
          catchError((error) => of(AcademiesActions.loadAcademiesFailure({ error })))
        );
      })
    )
  );
}
