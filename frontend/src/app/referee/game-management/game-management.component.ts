import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { UserService } from 'src/app/_services/user.service';
import * as UserActions from "../../_store/actions/users.actions";
import * as PlayerSelectors from "../../_store/selectors/players.selectors";
import * as FixtureSelectors from "../../_store/selectors/fixures.selectors";
import * as FixureActions from "../../_store/actions/fixures.actions";

@Component({
  selector: 'app-game-management',
  templateUrl: './game-management.component.html',
  styleUrls: ['./game-management.component.scss']
})
export class GameManagementComponent implements OnInit {
  @ViewChild('myTable') table:any;
  options = {}
  fixtures:any = [];
  columns:any = [{ prop: 'firstname' }, { name: 'lastname' }, { name: 'dob' } , { name: 'email' }];
  loadingIndicator = true;
  reorderable = true;
  ColumnMode = ColumnMode;
  homeTeamSquad:any = [];
  awayTeamSquad:any = [];
  constructor(private store: Store, private userService: UserService) {
    this.fetchFixtures()
  }
  ngOnInit(): void {
      // now get the leagues and map
      this.store.select(FixtureSelectors.getFixtures).subscribe(fixtures => {
        if(fixtures) {
          this.fixtures = fixtures;
        }
      })
  }
  fetchFixtures() {
    this.store.dispatch(FixureActions.loadFixtures());
  }

  getFixtureDetails(event: any){
    console.log(event)
  }

  edit(value: any) {
      console.log(value);
      this.userService.deleteUser(value).subscribe((result:any)  => {
        console.log(result)
        this.store.dispatch(UserActions.loadUsers());
      })
    }

    deletePlayer(value: any) {
      this.userService.deleteUser(value).subscribe((result:any)  => {
        this.store.dispatch(UserActions.loadUsers());
      })
    }

}
