import { Injectable } from "@angular/core";
import * as CompititionActions from "../actions/compititions.actions";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, exhaustMap, catchError, mergeMap } from "rxjs/operators";
import { of } from "rxjs";
import { CompititionService } from "src/app/_services/compitition.service";
import { StorageService } from "src/app/_services/storage.service";

@Injectable()
export class CompititionsEffects {
  user: any;
  constructor(private actions$: Actions, private compititionService: CompititionService, private storageService: StorageService) {
    this.user = this.storageService.getUser();
  }

  loadCompititions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CompititionActions.loadCompititions),
      map((action: any) => action.payload),
      mergeMap(() => {
        if (!this.user?.roles.includes("ROLE_SUPERADMIN")) {
          return this.compititionService.getCompititions().pipe(
            map((data) => {
              return Array.isArray(data)
                ? CompititionActions.loadCompititionsSuccess({ data })
                : CompititionActions.loadCompititionsSuccess({ data: [] });
            }),
            catchError((error) => of(CompititionActions.loadCompititionsFailure({ error })))
          );
        } else {
          return this.compititionService.getCompititions().pipe(
            map((data) => {
              console.log(data);
              return Array.isArray(data)
                ? CompititionActions.loadCompititionsSuccess({ data })
                : CompititionActions.loadCompititionsSuccess({ data: [] });
            }),
            catchError((error) => of(CompititionActions.loadCompititionsFailure({ error })))
          );
        }
      })
    )
  );
}
