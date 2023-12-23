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
  selectedCmp: any;
  shortCode: any;
  constructor(private actions$: Actions, private usersService: UserService, private storageService: StorageService) {
    this.user = this.storageService.getUser();
    this.selectedCmp = this.storageService.getCompetition();
    if (this.selectedCmp) {
      this.shortCode = this.selectedCmp.shortcode;
    } else {
      this.shortCode = this.user?.shortcode || "yfl";
    }
  }

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers),
      map((action: any) => action.payload),
      mergeMap(() => {
        if (!this.user?.roles.includes("ROLE_SUPERADMIN")) {
          return this.usersService.loadUsersByShortcode(this.user.shortcode).pipe(
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
