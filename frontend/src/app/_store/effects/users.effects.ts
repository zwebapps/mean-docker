import { Injectable } from "@angular/core";
import { UserService } from "../../_services/user.service";
import * as UserActions from "../actions/users.actions";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, exhaustMap, catchError, mergeMap } from "rxjs/operators";
import { of } from "rxjs";
import { StorageService } from "src/app/_services/storage.service";

@Injectable()
export class UsersEffects {
  user: any;
  constructor(private actions$: Actions, private usersService: UserService, private storageService: StorageService) {
    this.user = this.storageService.getUser();
  }

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers),
      map((action: any) => action.payload),
      mergeMap(() => {
        if (!this.user?.roles.includes("ROLE_SUPERADMIN")) {
          return this.usersService.loadUsersByCompitition(this.user.compitition).pipe(
            map((data) => (Array.isArray(data) ? UserActions.loadUsersSuccess({ data }) : UserActions.loadUsersSuccess({ data: [] }))),
            catchError((error) => of(UserActions.loadUsersFailure({ error })))
          );
        } else {
          return this.usersService.loadUsers().pipe(
            map((data) => (Array.isArray(data) ? UserActions.loadUsersSuccess({ data }) : UserActions.loadUsersSuccess({ data: [] }))),
            catchError((error) => of(UserActions.loadUsersFailure({ error })))
          );
        }
      })
    )
  );
}
