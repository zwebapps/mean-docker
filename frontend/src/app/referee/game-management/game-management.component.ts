import { Component, OnInit, ViewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { UserService } from "src/app/_services/user.service";
import * as UserActions from "../../_store/actions/users.actions";
import * as PlayerSelectors from "../../_store/selectors/players.selectors";
import * as FixtureSelectors from "../../_store/selectors/fixures.selectors";
import * as FixureActions from "../../_store/actions/fixures.actions";
import { FixtureService } from "src/app/_services/fixture.service";
import { NotifierService } from "angular-notifier";
import * as moment from "moment";
import { StorageService } from "src/app/_services/storage.service";

@Component({
  selector: "app-game-management",
  templateUrl: "./game-management.component.html",
  styleUrls: ["./game-management.component.scss"]
})
export class GameManagementComponent implements OnInit {
  private notifier: NotifierService;
  @ViewChild("myTable") table: any;
  options = {};
  fixtures: any = [];
  columns: any = [{ prop: "firstname" }, { name: "lastname" }, { name: "dob" }, { name: "email" }];
  loadingIndicator = true;
  reorderable = true;
  ColumnMode = ColumnMode;
  homeTeamSquad: any = [];
  awayTeamSquad: any = [];
  refereeDetails: any = {};
  constructor(
    private store: Store,
    notifier: NotifierService,
    private userService: UserService,
    private fixtureService: FixtureService,
    private storageService: StorageService
  ) {
    this.notifier = notifier;
    this.fetchFixtures();
  }
  ngOnInit(): void {
    // get ref details
    this.refereeDetails = this.storageService.getUser();
    // now get the leagues and map
    this.store.select(FixtureSelectors.getFixtures).subscribe((fixtures) => {
      if (fixtures) {
        this.fixtures = fixtures.filter((fix: any) => fix.user_id && fix.user_id._id === this.refereeDetails.id);
      }
    });
  }
  fetchFixtures() {
    this.store.dispatch(FixureActions.loadFixtures());
  }

  getFixtureDetails(event: any) {
    console.log(event);
  }

  edit(value: any) {
    this.userService.deleteUser(value).subscribe(
      (result: any) => {
        console.log(result);
        this.store.dispatch(UserActions.loadUsers());
      },
      (error) => {
        this.notifier.notify("error", "Please try again!");
      }
    );
  }

  deleteFixture(value: any) {
    this.fixtureService.deleteFixture(value).subscribe(
      (result: any) => {
        if (result) {
          this.notifier.notify("success", "Fixture deleted successfully");
          this.fetchFixtures();
        }
      },
      (error) => {
        this.notifier.notify("error", "Please try again!");
      }
    );
  }
}
