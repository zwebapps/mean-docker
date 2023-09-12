import { Injectable } from "@angular/core";
import { UserService } from "../../_services/user.service";
import * as NotificationActions from "../actions/notification.actions";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, catchError, mergeMap } from "rxjs/operators";
import { of } from "rxjs";

@Injectable()
export class NotificationsEffects {
  constructor(private actions$: Actions, private UserService: UserService) {}

  loadNotifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationActions.loadNotifications),
      map((action: any) => action.payload),
      mergeMap(() => {
        return this.UserService.getAllContents().pipe(
          map((data) =>
            Array.isArray(data)
              ? NotificationActions.loadNotificationsSuccess({ data })
              : NotificationActions.loadNotificationsSuccess({ data: [] })
          ),
          catchError((error) => of(NotificationActions.loadNotificationsFailure({ error })))
        );
      })
    )
  );
}
