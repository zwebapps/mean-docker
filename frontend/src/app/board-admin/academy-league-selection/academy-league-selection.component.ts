import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TeamService } from "src/app/_services/team.service";
import { FormGroup, FormControl, FormArray, FormBuilder } from "@angular/forms";
// importing selectors
import * as LeagueSelectors from "../../_store/selectors/leagues.selectors";
import { Store } from "@ngrx/store";
import { NotifierService } from "angular-notifier";
import { environment } from "src/environments/environment";
import { StorageService } from "src/app/_services/storage.service";

@Component({
  selector: "app-academy-league-selection",
  templateUrl: "./academy-league-selection.component.html",
  styleUrls: ["./academy-league-selection.component.scss"]
})
export class AcademyLeagueSelectionComponent implements OnInit {
  user: any = {};
  private notifier: NotifierService;
  public team: any;
  public academy: any;
  public leagues: any = [];
  public leagueForm: FormGroup;
  apiURL = environment.apiURL;
  constructor(
    private storageService: StorageService,
    private activatedRoute: ActivatedRoute,
    private teamService: TeamService,
    private fb: FormBuilder,
    private store: Store,
    notifier: NotifierService,
    private router: Router
  ) {
    this.user = this.storageService.getUser();
    this.notifier = notifier;
    this.leagueForm = this.fb.group({
      leagues: new FormArray([])
    });
  }
  getLeagueNo(leagueName: any) {
    if (leagueName) {
      let nameArray = leagueName.match(/(\d+)/);
      return nameArray ? nameArray.find((nm: any) => !isNaN(nm)) : null;
    }
  }
  ngOnInit(): void {
    // now get the leagues and map
    this.getLeaguesFromLeague();
    let id = this.activatedRoute.snapshot.params["id"];
    this.getTeamsById(id);
    // getting leagues
    // this.store.select(LeagueSelectors.getLeagues).subscribe((leagues) => {
    //   if (leagues) {
    //     this.leagues = leagues;
    //   }
    // });
    this.getLeaguesFromLeague();
  }

  getTeamsById = (teamID: any) => {
    this.teamService.getTeamById(teamID).subscribe((res: any) => {
      if (res) {
        this.team = res;
        this.academy = res.academy_id;
        if (this.leagues.length > 0) {
          // sort the leagues
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
  };
  getLeaguesFromLeague = () => {
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
  };
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
    this.router.navigate([`${this.user.shortcode}/admin/academies/academy/` + this.academy._id]);
  }
}
