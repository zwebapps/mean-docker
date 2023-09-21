import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TeamService } from "src/app/_services/team.service";
import { FormGroup, FormControl, FormArray, FormBuilder } from "@angular/forms";
// importing selectors
import * as LeagueSelectors from "../../_store/selectors/leagues.selectors";
import { Store } from "@ngrx/store";
import { NotifierService } from "angular-notifier";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-academy-league-selection",
  templateUrl: "./academy-league-selection.component.html",
  styleUrls: ["./academy-league-selection.component.scss"]
})
export class AcademyLeagueSelectionComponent implements OnInit {
  private notifier: NotifierService;
  public team: any;
  public academy: any;
  public leagues: any = [];
  public leagueForm: FormGroup;
  apiURL = environment.apiURL;
  constructor(
    private activatedRoute: ActivatedRoute,
    private teamService: TeamService,
    private fb: FormBuilder,
    private store: Store,
    notifier: NotifierService,
    private router: Router
  ) {
    this.notifier = notifier;
    this.leagueForm = this.fb.group({
      leagues: new FormArray([])
    });
  }
  ngOnInit(): void {
    // now get the leagues and map
    this.store.select(LeagueSelectors.getLeagues).subscribe((leagues) => {
      if (leagues) {
        this.leagues = leagues;
      }
    });
    let id = this.activatedRoute.snapshot.params["id"];
    this.teamService.getTeamById(id).subscribe((res: any) => {
      if (res) {
        this.team = res;
        this.academy = res.academy_id;
        if (this.leagues.length > 0) {
          this.leagues = this.leagues.map((league: any) => {
            let selectedLeague = this.team.leagues.find((lg: any) => lg._id == league._id);
            return {
              ...league,
              selected: selectedLeague ? true : false
            };
          });
        }
      }
    });

    // getting leagues
    this.store.select(LeagueSelectors.getLeagues).subscribe((leagues) => {
      if (leagues) {
        this.leagues = leagues;
      }
    });
  }
  getImg = (image: string) => {
    return `${this.apiURL}/static/${image}`;
  };
  get leaguesArray(): FormArray {
    return this.leagueForm.get("leagues") as FormArray;
  }
  private addCheckboxes(leagues: any) {
    leagues.forEach((league: any) => this.leaguesArray.push(new FormControl(league)));
  }
  onFormSubmit = () => {
    console.log(this.leagues);
    this.team.leagues = this.leagues.filter((league: any) => league.selected).map((league: any) => league._id);
    this.teamService.updateTeam(this.team._id, this.team).subscribe((res: any) => {
      if (!res.message) {
        this.notifier.notify("success", "Team updated successfully!");
      } else {
        this.notifier.notify("error", "Team updating failed!");
      }
    });
  };
  onCheckBox() {
    console.log(this.leagues);
  }

  redirectTo() {
    this.router.navigate(["/admin/academies/academy/" + this.academy._id]);
  }
}
