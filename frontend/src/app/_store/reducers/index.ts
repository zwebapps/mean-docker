import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../../environments/environment';
import * as fromUserReducer from './users.reducer';
import * as fromTeamReducer from './teams.reducer';
import * as fromPlayerReducer from './players.reducer';
import * as fromLeagueReducer from './leagues.reducer';
import * as fromFixtureReducer from './fixtures.reducer';
import * as fromAcademyReducer from './academies.reducer';
import * as fromNotificationReducer from './notifications.reducer';


export interface State {
  users : fromUserReducer.State,
  teams : fromTeamReducer.State,
  players : fromPlayerReducer.State,
  leagues : fromLeagueReducer.State,
  fixtures : fromFixtureReducer.State,
  academies : fromAcademyReducer.State
  notifications: fromNotificationReducer.State
}

export const reducers: ActionReducerMap<State> = {
  users: fromUserReducer.reducer,
  teams: fromTeamReducer.reducer,
  players: fromPlayerReducer.reducer,
  leagues: fromLeagueReducer.reducer,
  fixtures: fromFixtureReducer.reducer,
  academies: fromAcademyReducer.reducer,
  notifications: fromNotificationReducer.reducer
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
