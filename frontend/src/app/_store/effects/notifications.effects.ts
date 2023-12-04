import { Injectable } from "@angular/core";
import { UserService } from "../../_services/user.service";
import * as NotificationActions from "../actions/notification.actions";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, catchError, mergeMap } from "rxjs/operators";
import { of } from "rxjs";
import { StorageService } from "src/app/_services/storage.service";

@Injectable()
export class NotificationsEffects {
  user: any;
  constructor(private actions$: Actions, private UserService: UserService, private storageService: StorageService) {
    this.user = this.storageService.getUser();
  }

  loadNotifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationActions.loadNotifications),
      map((action: any) => action.payload),
      mergeMap(() => {
        if (!this.user?.roles.includes("ROLE_SUPERADMIN")) {
          return this.UserService.getAllContentsByCompitition(this.user.compitition).pipe(
            map((data) =>
              Array.isArray(data)
                ? NotificationActions.loadNotificationsSuccess({ data })
                : NotificationActions.loadNotificationsSuccess({ data: [] })
            ),
            catchError((error) => of(NotificationActions.loadNotificationsFailure({ error })))
          );
        } else {
          return this.UserService.getAllContents().pipe(
            map((data) =>
              Array.isArray(data)
                ? NotificationActions.loadNotificationsSuccess({ data })
                : NotificationActions.loadNotificationsSuccess({ data: [] })
            ),
            catchError((error) => of(NotificationActions.loadNotificationsFailure({ error })))
          );
        }
      })
    )
  );
}
