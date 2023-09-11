import { Injectable } from '@angular/core';
import { UserService } from '../../_services/user.service';
import * as UserActions from '../actions/users.actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, exhaustMap, catchError, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class UsersEffects {
  constructor(private actions$: Actions, private usersService:UserService) {}

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers),
      map((action: any) => action.payload),
      mergeMap(() => {
        return this.usersService.loadUsers().pipe(map(data => UserActions.loadUsersSuccess({ data })),
          catchError(error => of(UserActions.loadUsersFailure({ error })))
        );
      })
    )
  )
}
