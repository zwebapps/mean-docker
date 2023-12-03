import { Injectable } from "@angular/core";
import { AcademyService } from "../../_services/academy.service";
import * as CompititionActions from "../actions/compititions.actions";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, exhaustMap, catchError, mergeMap } from "rxjs/operators";
import { of } from "rxjs";
import { CompititionService } from "src/app/_services/compitition.service";

@Injectable()
export class AcademiesEffects {
  constructor(private actions$: Actions, private compititionService: CompititionService) {}

  loadAcademies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CompititionActions.loadCompititions),
      map((action: any) => action.payload),
      mergeMap(() => {
        return this.compititionService.getCompititions().pipe(
          map((data) =>
            Array.isArray(data)
              ? CompititionActions.loadCompititionsSuccess({ data })
              : CompititionActions.loadCompititionsSuccess({ data: [] })
          ),
          catchError((error) => of(CompititionActions.loadCompititionsFailure({ error })))
        );
      })
    )
  );
}
