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
  @ViewChild("myTable") table: any;
  public selectedLeagues: any = [];
  public selectedTeams: any = [];
  public selectedMVP: any = [];
  public dropdownList: any = ["Team", "League", "MVP"];
  dropdownObj: any = {
    Team: [],
    League: [],
    MVP: []
  };
  private notifier: NotifierService;
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
  public selectedCompetition: any = {};
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
    this.store.dispatch(FixureActions.loadFixtures());
    this.getSelectedCompetition();
    // get ref details
    this.admin = this.storageService.getUser();
    // now get the leagues and map
    this.getFixturesFromStores();
  }
  isChecked(filterType: any, obj: any) {
    if (filterType === "Team") {
      return this.selectedTeams.includes(obj._id);
    } else if (filterType === "League") {
      return this.selectedLeagues.includes(obj?.league?._id);
    } else if (filterType === "MVP") {
      return this.selectedMVP.includes(obj?.mvp?._id);
    } else {
      return false;
    }
  }
  removeFilter(filter: string) {
    this.filters = this.filters.filter((f) => f !== filter);
    if (filter === "Team") {
      this.selectedTeams = [];
    }
    if (filter === "League") {
      this.selectedLeagues = [];
    }
    if (filter === "MVP") {
      this.selectedMVP = [];
    }
    this.getFixturesFromStores();
  }
  getFixturesFromStores() {
    this.store.select(FixtureSelectors.getFixtures).subscribe((fixtures) => {
      if (fixtures) {
        this.fixtures = fixtures.filter((fix: any) => fix?.shortcode === this.admin.shortcode);
        if (this.fixtures.length > 0) {
          this.fixtures.forEach((fixture: any) => {
            // check if exits already
            if (!this.dropdownObj["League"].find((lg: any) => lg?._id === fixture?.league?._id)) {
              this.dropdownObj["League"].push(fixture?.league);
            }
            // check if exits already
            if (!this.dropdownObj["Team"].find((tm: any) => tm?._id === fixture?.awayTeam?._id)) {
              this.dropdownObj["Team"].push(fixture?.awayTeam);
            }
            // check if exits already
            if (!this.dropdownObj["Team"].find((tm: any) => tm?._id === fixture?.homeTeam?._id)) {
              this.dropdownObj["Team"].push(fixture?.homeTeam);
            }
            // check if exits already
            if (fixture?.mvp) {
              if (!this.dropdownObj["MVP"].find((tm: any) => fixture?.mvp?._id === tm?._id)) {
                this.dropdownObj["MVP"].push(fixture?.mvp);
              }
            }
            // filter based on teams and leagues
            if (this.selectedTeams.length > 0) {
              this.fixtures = fixtures.filter(
                (tm: any) => this.selectedTeams.includes(tm?.awayTeam?._id) || this.selectedTeams.includes(tm?.homeTeam?._id)
              );
            }
            if (this.selectedLeagues.length > 0) {
              this.fixtures = fixtures.filter((tm: any) => this.selectedLeagues.includes(tm?.league?._id));
            }

            // filter based on teams and leagues
            if (this.selectedMVP.length > 0) {
              this.fixtures = fixtures.filter((tm: any) => this.selectedMVP.includes(tm?.mvp?._id));
            }
          });
        }
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
    this.getFixturesFromStores();
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
  filterByType(filterType: any, child: any) {
    if (filterType === "Team") {
      if (!this.selectedTeams.includes(child._id)) {
        this.selectedTeams.push(child._id);
      } else {
        let index = this.selectedTeams.indexOf(child._id);
        this.selectedTeams.splice(index, 1);
      }
    }
    if (filterType === "League") {
      if (!this.selectedLeagues.includes(child?._id)) {
        this.selectedLeagues.push(child?._id);
      } else {
        let index = this.selectedLeagues.indexOf(child?._id);
        this.selectedLeagues.splice(index, 1);
      }
    }
    if (filterType === "MVP") {
      if (!this.selectedMVP.includes(child?._id)) {
        this.selectedMVP.push(child?._id);
      } else {
        let index = this.selectedMVP.indexOf(child?._id);
        this.selectedMVP.splice(index, 1);
      }
    }
    this.getFixturesFromStores();
  }

  getSelectedCompetition() {
    this.selectedCompetition = this.storageService.getCompetition();
  }
}
