import { Component, ViewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { NotifierService } from "angular-notifier";
import { FixtureService } from "src/app/_services/fixture.service";
import { StorageService } from "src/app/_services/storage.service";
import { UserService } from "src/app/_services/user.service";
import * as FixtureSelectors from "../../_store/selectors/fixures.selectors";
import * as FixureActions from "../../_store/actions/fixures.actions";
import * as moment from "moment";

@Component({
  selector: "app-admin-fixture-results",
  templateUrl: "./admin-fixture-results.component.html",
  styleUrls: ["./admin-fixture-results.component.scss"]
})
export class AdminFixtureResultsComponent {
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
  public admin: any = {};
  // Filters
  public filters: string[] = [];
  constructor(
    private store: Store,
    notifier: NotifierService,
    private fixtureService: FixtureService,
    private storageService: StorageService
  ) {
    this.notifier = notifier;
    this.fetchFixtures();
  }
  ngOnInit(): void {
    // get ref details
    this.admin = this.storageService.getUser();
    // now get the leagues and map
    this.getFixturesFromStores();
  }
  getFixturesFromStores() {
    this.store.select(FixtureSelectors.getFixtures).subscribe((fixtures) => {
      if (fixtures) {
        this.fixtures = fixtures.filter((fix: any) => fix?.shortcode === this.admin.shortcode);
      }
    });
  }
  fetchFixtures() {
    this.store.dispatch(FixureActions.loadFixtures());
  }

  getFixtureDetails(event: any) {
    console.log(event);
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
  updateFixture(fixture: any) {
    console.log("updateFixture", fixture);
    this.fixtureService.updateFixture(fixture._id, fixture).subscribe((result: any) => {
      if (result) {
        this.notifier.notify("success", "Fixture updated successfully");
        this.fetchFixtures();
      }
    });
  }

  addFilter(filter: string) {
    if (!this.filters.includes(filter)) {
      this.filters.push(filter);
      this.sortFixturesByType();
    }
  }
  sortFixturesByType() {
    if (this.filters.includes("League")) {
      this.fixtures = this.fixtures.slice().sort((a: any, b: any) => a?.league?.leagueName?.localeCompare(b?.league?.leagueName));
    }
    if (this.filters.includes("Date")) {
      this.fixtures = this.fixtures.slice().sort((a: any, b: any) => (moment(a?.matchDate).isAfter(b?.matchDate) ? 1 : -1));
    } else {
      this.fixtures = this.fixtures.slice().sort((a: any, b: any) => (moment(b?.matchDate).isAfter(a?.matchDate) ? 1 : -1));
    }
    if (this.filters.includes("Team")) {
      this.fixtures = this.fixtures.slice().sort((a: any, b: any) => a?.homeTeam?.teamName?.localeCompare(b?.homeTeam?.teamName));
      this.fixtures = this.fixtures.slice().sort((a: any, b: any) => a?.awayTeam?.teamName?.localeCompare(b?.awayTeam?.teamName));
    }
    if (this.filters.includes("MVP")) {
      this.fixtures = this.fixtures.slice().sort((a: any, b: any) => a?.mvp?.firstName?.localeCompare(b?.mvp?.firstName));
    }
  }

  filterClubs(event: any) {
    if (event) {
      this.getFixturesFromStores();
      this.fixtures = this.fixtures.filter(
        (fix: any) =>
          fix?.league?.leagueName?.toLowerCase().includes(event.toLowerCase()) ||
          fix?.homeTeam?.teamName?.toLowerCase().includes(event.toLowerCase()) ||
          fix?.awayTeam?.teamName?.toLowerCase().includes(event.toLowerCase()) ||
          fix?.mvp?.firstName?.toLowerCase().includes(event.toLowerCase()) ||
          fix.mvp?.lastName?.toLowerCase().includes(event.toLowerCase())
      );
    } else {
      this.getFixturesFromStores();
    }
  }

  removeFilter(filter: string) {
    this.filters = this.filters.filter((f) => f !== filter);
    this.sortFixturesByType();
  }
}
