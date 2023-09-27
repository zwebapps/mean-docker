import { Component, OnInit } from "@angular/core";
import * as AcademyActions from "../../_store/actions/academies.actions";
// importing selectors
import * as AcademySelectors from "../../_store/selectors/academies.selectors";
import { Store } from "@ngrx/store";
import { Router, ActivatedRoute } from "@angular/router";
import { NotifierService } from "angular-notifier";
import { AcademyService } from "src/app/_services/academy.service";
import { StorageService } from "src/app/_services/storage.service";
import { TeamService } from "src/app/_services/team.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-squad-academy-list",
  templateUrl: "./squad-academy-list.component.html",
  styleUrls: ["./squad-academy-list.component.scss"]
})
export class SquadAcademyListComponent implements OnInit {
  public teams: any = [];
  private notifier: NotifierService;
  public academies: any = [];
  public academy: any = {};
  apiURL = environment.apiURL;
  constructor(
    notifier: NotifierService,
    private academyService: AcademyService,
    private teamService: TeamService,
    private router: Router,
    public activatedRoute: ActivatedRoute
  ) {
    this.notifier = notifier;
  }

  ngOnInit(): void {
    let id = this.activatedRoute.snapshot.params["id"];
    this.academyService.getAcademyById(id).subscribe(
      (res: any) => {
        if (res) {
          this.academy = res;
        } else {
          this.notifier.notify("error", "Academy not found!");
        }
      },
      (err) => {
        this.notifier.notify("error", "Please try again!");
      }
    );
    this.getTeamsByAcademy(id);
  }
  onTeamClick(team: any) {
    this.router.navigate([`/admin/academy/team/${team._id}`]);
  }
  getTeamsByAcademy(academyId: string) {
    this.teamService.getTeamsByAcademy(academyId).subscribe(
      (res: any) => {
        if (!res.message) {
          this.teams = res;
        } else {
          this.notifier.notify("error", "Teams not found!");
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
  redirectTo() {
    this.router.navigate(["/admin/academies"]);
  }
}
