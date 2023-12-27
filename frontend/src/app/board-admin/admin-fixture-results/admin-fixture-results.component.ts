import { Component, ViewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { NotifierService } from "angular-notifier";
import { FixtureService } from "src/app/_services/fixture.service";
import { StorageService } from "src/app/_services/storage.service";
import { UserService } from "src/app/_services/user.service";
import * as FixtureSelectors from "../../_store/selectors/fixures.selectors";
import * as FixureActions from "../../_store/actions/fixures.actions";

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

  // Filters
  filters: string[] = [];
  addFilter(filter: string) {
    if (!this.filters.includes(filter)) {
      this.filters.push(filter);
    }
  }

  removeFilter(filter: string) {
    this.filters = this.filters.filter(f => f !== filter);
  }
}
