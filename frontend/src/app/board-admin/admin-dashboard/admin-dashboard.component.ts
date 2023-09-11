import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserService } from 'src/app/_services/user.service';
import { topcard, topcards} from 'src/app/dashboard/dashboard-components/top-cards/top-cards-data';
import * as UserSelectors from "../../_store/selectors/users.selectors";
import * as TeamSelectors from "../../_store/selectors/teams.selectors";

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  topcards:topcard[];
  users: any = [];
  teams: any = [];
  constructor(private store: Store) {
    this.topcards = topcards;
  }

  ngOnInit(): void {
       // select to get user from store
       this.store.select(UserSelectors.getUsers).subscribe(users => {
        this.users = users;
       });

       this.store.select(TeamSelectors.getTeams).subscribe(teams => {
        this.teams = teams;
       });
  }

}
