import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
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
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { FixtureService } from "src/app/_services/fixture.service";

@Component({
  selector: "app-referee-dashboard",
  templateUrl: "./referee-dashboard.component.html",
  styleUrls: ["./referee-dashboard.component.scss"]
})
export class RefereeDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild("myTable") table: any;
  private notifier: NotifierService;
  public submitted = false;
  options = {};
  data: any = [];
  columns: any = [{ prop: "firstname" }, { name: "lastname" }, { name: "dob" }, { name: "email" }];
  loadingIndicator = true;
  reorderable = true;
  ColumnMode = ColumnMode;
  public userForm: FormGroup;
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
    private fixtureService: FixtureService,
    private formBuilder: FormBuilder
  ) {
    this.notifier = notifier;
    this.getFixturesFromStore();
    // this.fixtureForm = new FormGroup({});
  }
  ngOnInit(): void {
    // get ref details
    this.refereeDetails = this.storageService.getUser();
    this.fixtureForm = this.formBuilder.group({
      matchDate: ["", Validators.required],
      league: ["", Validators.required],
      homeTeam: ["", Validators.required],
      awayTeam: ["", Validators.required]
    });
    // now get the leagues and map
    this.store.select(LeagueSelectors.getLeagues).subscribe((leagues) => {
      if (leagues) {
        this.leagues = leagues.slice().sort((a, b) => {
          const aNumber = parseInt(this.getLeagueNo(a?.leagueName));
          const bNumber = parseInt(this.getLeagueNo(b?.leagueName));

          if (isNaN(aNumber) || isNaN(bNumber)) {
            return a?.leagueName.localeCompare(b?.leagueName);
          }

          return aNumber - bNumber;
        });
      }
    });
    // now get the leagues and map
    this.store.select(TeamSelectors.getTeams).subscribe((teams) => {
      if (teams.length > 0) {
        this.allTeams = teams.slice().sort((a, b) => a?.teamName?.localeCompare(b?.teamName));
        this.homeTeams = teams.slice().sort((a, b) => a?.teamName?.localeCompare(b?.teamName));
        this.awayTeams = teams.slice().sort((a, b) => a?.teamName?.localeCompare(b?.teamName));
      }
    });

    // now get the leagues and map
    this.store.select(FixtureSelectors.getFixtures).subscribe((fixtures) => {
      if (Array.isArray(fixtures)) {
        this.fixtures = fixtures.filter((fix) => fix.user_id._id === this.refereeDetails.id);
      } else {
        this.notifier.notify("error", "Fixtures not yet added");
      }
    });
  }
  ngAfterViewInit(): void {
    this.setMinDate();
  }

  getLeagueNo(leagueName: any) {
    let nameArray = leagueName.match(/(\d+)/);
    return nameArray ? nameArray.find((nm: any) => !isNaN(nm)) : null;
  }

  get f() {
    return this.fixtureForm.controls;
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
  setMinDate = () => {
    const [today] = new Date().toISOString().split("T");
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 120);
    const [maxDateFormatted] = maxDate.toISOString().split("T");

    const dateInput = document.getElementById("currentDate");
    dateInput.setAttribute("min", today);
    dateInput.setAttribute("max", maxDateFormatted);
  };
  onFormSubmit() {
    const loggedInRef = this.storageService.getUser();
    console.log(this.fixtureForm.value);
    this.submitted = true;
    if (this.fixtureForm.invalid) {
      this.notifier.notify("error", "Please select all the fields");
      return;
    } else {
      // check if both teams are same
      if (this.fixtureForm.value.homeTeam === this.fixtureForm.value.awayTeam) {
        this.notifier.notify("error", "Both teams should be different");
        return;
      }
      const fixtureObj = {
        matchDate: this.fixtureForm.value.matchDate,
        league: this.fixtureForm.value.league,
        homeTeam: this.fixtureForm.value.homeTeam,
        awayTeam: this.fixtureForm.value.awayTeam,
        shortcode: loggedInRef?.shortcode,
        competition: loggedInRef?.competition[0]._id,
        user: {
          createdBy: loggedInRef?.id
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
