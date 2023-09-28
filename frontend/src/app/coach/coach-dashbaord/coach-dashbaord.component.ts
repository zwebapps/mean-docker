import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import * as PlayerSelectors from "../../_store/selectors/players.selectors";
import * as TeamSelectors from "../../_store/selectors/teams.selectors";
import { ActivatedRoute } from "@angular/router";
import { StorageService } from "src/app/_services/storage.service";
import { AcademyService } from "src/app/_services/academy.service";
import { TeamService } from "src/app/_services/team.service";
import { environment } from "src/environments/environment";
import { NotifierService } from "angular-notifier";

@Component({
  selector: "app-coach-dashbaord",
  templateUrl: "./coach-dashbaord.component.html",
  styleUrls: ["./coach-dashbaord.component.scss"]
})
export class CoachDashbaordComponent implements OnInit {
  private notifier: NotifierService;
  players: any = [];
  teams: any = [];
  loggedInCoach: any;
  academy: any;
  apiURL = environment.apiURL;
  constructor(
    notifier: NotifierService,
    private store: Store,
    private activatedRoute: ActivatedRoute,
    private storageService: StorageService,
    private academyService: AcademyService,
    private teamService: TeamService
  ) {
    this.notifier = notifier;
  }

  ngOnInit(): void {
    // get the logged in coach
    this.loggedInCoach = this.storageService.getUser();
    if (this.loggedInCoach) {
      this.academyService.getAcademyByCoachId(this.loggedInCoach.id).subscribe(
        (res: any) => {
          if (res) {
            this.academy = res;
            this.getTeamsByAcademy(res._id);
            // select to get user from store
            this.store.select(PlayerSelectors.getPlayers).subscribe((players) => {
              this.players = players.filter((player: any) => player.academy && player.academy._id == this.academy._id);
            });
          }
        },
        (err) => {
          this.notifier.notify("error", "Please try again!");
        }
      );
    }
  }
  getTeamsByAcademy(id: any) {
    this.teamService.getTeamsByAcademy(id).subscribe(
      (res: any) => {
        if (res) {
          this.teams = res;
        }
      },
      (err) => {
        this.notifier.notify("error", "Please try again!");
      }
    );
  }
  getImg = (image: string) => {
    return `${this.apiURL}/static/${image}`;
  };
}
