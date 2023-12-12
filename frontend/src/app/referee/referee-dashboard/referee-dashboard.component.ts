import { Component, OnInit, ViewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { UserService } from "src/app/_services/user.service";
import * as UserActions from "../../_store/actions/users.actions";
import * as FixureActions from "../../_store/actions/fixures.actions";
import * as PlayerSelectors from "../../_store/selectors/players.selectors";
import * as LeagueSelectors from "../../_store/selectors/leagues.selectors";
import * as TeamSelectors from "../../_store/selectors/teams.selectors";
import * as FixtureSelectors from "../../_store/selectors/fixures.selectors";
import { NotifierService } from "angular-notifier";
import { Router, ActivatedRoute } from "@angular/router";
import { AcademyService } from "src/app/_services/academy.service";
import { StorageService } from "src/app/_services/storage.service";
import { TeamService } from "src/app/_services/team.service";
import { FormControl, FormGroup } from "@angular/forms";
import { FixtureService } from "src/app/_services/fixture.service";

@Component({
  selector: "app-referee-dashboard",
  templateUrl: "./referee-dashboard.component.html",
  styleUrls: ["./referee-dashboard.component.scss"]
})
export class RefereeDashboardComponent implements OnInit {
  @ViewChild("myTable") table: any;
  private notifier: NotifierService;
  options = {};
  data: any = [];
  columns: any = [{ prop: "firstname" }, { name: "lastname" }, { name: "dob" }, { name: "email" }];
  loadingIndicator = true;
  reorderable = true;
  ColumnMode = ColumnMode;
  public leagues: any = [];
  public homeTeams: any = [];
  public awayTeams: any = [];
  public fixtures: any = [];
  public fixtureForm: FormGroup;
  public selectedLeague: any = null;
  public allTeams: any = [];
  public refereeDetails: any = {};
  constructor(
    private userService: UserService,
    private storageService: StorageService,
    notifier: NotifierService,
    private academyService: AcademyService,
    private teamService: TeamService,
    private store: Store,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private fixtureService: FixtureService
  ) {
    this.notifier = notifier;
    this.getFixturesFromStore();
    this.fixtureForm = new FormGroup({});
  }
  ngOnInit(): void {
    // get ref details
    this.refereeDetails = this.storageService.getUser();
    this.fixtureForm = new FormGroup({
      league: new FormControl(""),
      homeTeam: new FormControl(""),
      awayTeam: new FormControl("")
    });
    // now get the leagues and map
    this.store.select(LeagueSelectors.getLeagues).subscribe((leagues) => {
      if (leagues) {
        this.leagues = leagues;
      }
    });
    // now get the leagues and map
    this.store.select(TeamSelectors.getTeams).subscribe((teams) => {
      if (teams) {
        this.allTeams = teams;
        this.homeTeams = teams;
        this.awayTeams = teams;
      }
    });

    // now get the leagues and map
    this.store.select(FixtureSelectors.getFixtures).subscribe((fixtures) => {
      if (Array.isArray(fixtures)) {
        this.fixtures = fixtures.filter((fix) => fix.user_id === this.refereeDetails.id);
      } else {
        this.notifier.notify("error", "Fixtures not yet added");
      }
    });
  }

  filterTeams = (event: any, type: string) => {
    const tm = event.target.value;
    if (type === "home") {
      this.awayTeams = this.allTeams;
      this.awayTeams = this.awayTeams.filter((team: any) => team._id !== tm);
    }
    if (type === "away") {
      this.homeTeams = this.allTeams;
      this.homeTeams = this.homeTeams.filter((team: any) => team._id !== tm);
    }
  };
  onFormSubmit() {
    if (this.fixtureForm.invalid) {
      this.notifier.notify("error", "Please select all the fields");
    } else {
      // check if both teams are same
      if (this.fixtureForm.value.homeTeam === this.fixtureForm.value.awayTeam) {
        this.notifier.notify("error", "Both teams should be different");
        return;
      }
      const fixtureObj = {
        league: this.fixtureForm.value.league,
        homeTeam: this.fixtureForm.value.homeTeam,
        awayTeam: this.fixtureForm.value.awayTeam,
        user: {
          createdBy: this.storageService.getUser().id
        }
      };
      this.fixtureService.createFixture(fixtureObj).subscribe((res: any) => {
        if (res) {
          this.notifier.notify("success", "Fixture created successfully");
        } else {
          this.notifier.notify("error", "Something went wrong");
        }
        this.fetchFixtures();
      });
    }
  }
  getFixturesFromStore() {
    // now get the leagues and map
    this.store.select(FixtureSelectors.getFixtures).subscribe((fixtures) => {
      if (Array.isArray(fixtures)) {
        // filter teams for referee
        this.fixtures = fixtures.filter((fix: any) => fix?.user_id === this.refereeDetails.id);
      }
    });
  }

  edit(value: any) {
    this.userService.deleteUser(value).subscribe((result: any) => {
      console.log(result);
      this.store.dispatch(UserActions.loadUsers());
    });
  }
  getTeamsForLeague(event: any) {
    this.selectedLeague = event.target.value;
    if (this.selectedLeague) {
      // // reset teams and filter again
      this.homeTeams = this.allTeams;
      this.awayTeams = this.allTeams;

      this.homeTeams = this.homeTeams.filter((team: any) => team.leagues.find((lg: any) => lg._id === this.selectedLeague));
      this.awayTeams = this.awayTeams.filter((team: any) => team.leagues.find((lg: any) => lg._id === this.selectedLeague));
    } else {
      this.notifier.notify("error", "Something went wrong");
    }
  }
  deleteFixture(value: any) {
    this.fixtureService.deleteFixture(value).subscribe((result: any) => {
      if (result) {
        this.notifier.notify("success", "Fixture deleted successfully");
        this.fetchFixtures();
      }
    });
  }

  fetchFixtures() {
    this.store.dispatch(FixureActions.loadFixtures());
  }
}
