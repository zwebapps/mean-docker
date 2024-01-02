import { Injectable } from "@angular/core";
import * as CompetitionActions from "../actions/competitions.actions";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, exhaustMap, catchError, mergeMap } from "rxjs/operators";
import { of } from "rxjs";
import { CompetitionService } from "src/app/_services/competition.service";
import { StorageService } from "src/app/_services/storage.service";

@Injectable()
export class CompetitionsEffects {
  user: any;
  selectedCmp: any;
  shortCode: any;
  constructor(private actions$: Actions, private competitionService: CompetitionService, private storageService: StorageService) {
    this.user = this.storageService.getUser();
    this.selectedCmp = this.storageService.getCompetition();
    if (this.selectedCmp) {
      this.shortCode = this.selectedCmp.shortcode;
    } else {
      this.shortCode = this.user?.shortcode || "yfl";
    }
  }

  loadCompetitions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CompetitionActions.loadCompetitions),
      map((action: any) => action.payload),
      mergeMap(() => {
        if (!this.user?.roles.includes("ROLE_SUPERADMIN")) {
          // get competition by logged in user
          return this.competitionService.getCompetitions().pipe(
            map((data) => {
              return Array.isArray(data)
                ? CompetitionActions.loadCompetitionsSuccess({ data })
                : CompetitionActions.loadCompetitionsSuccess({ data: [] });
            }),
            catchError((error) => of(CompetitionActions.loadCompetitionsFailure({ error })))
          );
        } else {
          return this.competitionService.getCompetitions().pipe(
            map((data) => {
              return Array.isArray(data)
                ? CompetitionActions.loadCompetitionsSuccess({ data })
                : CompetitionActions.loadCompetitionsSuccess({ data: [] });
            }),
            catchError((error) => of(CompetitionActions.loadCompetitionsFailure({ error })))
          );
        }
      })
    )
  );
}
