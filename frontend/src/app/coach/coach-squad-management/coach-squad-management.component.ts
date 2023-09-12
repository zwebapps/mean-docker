import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NotifierService } from "angular-notifier";
import { AcademyService } from "src/app/_services/academy.service";
import { PlayerService } from "src/app/_services/player.service";
import { StorageService } from "src/app/_services/storage.service";
import { TeamService } from "src/app/_services/team.service";
import { UserService } from "src/app/_services/user.service";

@Component({
  selector: "app-coach-squad-management",
  templateUrl: "./coach-squad-management.component.html",
  styleUrls: ["./coach-squad-management.component.scss"]
})
export class CoachSquadManagementComponent implements OnInit {
  private notifier: NotifierService;
  private loggedInCoach: any = {};
  public academy: any;
  public teams: any = [];
  constructor(
    notifier: NotifierService,
    private academyService: AcademyService,
    private teamService: TeamService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private storagService: StorageService
  ) {
    this.notifier = notifier;
    // get the logged in coach
    this.loggedInCoach = this.storagService.getUser();
    this.academyService.getAcademyByCoachId(this.loggedInCoach.id).subscribe((res: any) => {
      if (res) {
        this.academy = res;
        this.getTeamsByAcademy(res._id);
      }
    });
  }
  ngOnInit(): void {}
  getTeamsByAcademy(academyId: string) {
    this.teamService.getTeamsByAcademy(academyId).subscribe((res: any) => {
      if (res) {
        this.teams = res;
      }
    });
  }

  onTeamClick(team: any) {
    this.router.navigate([`/coach/squads/${team._id}`]);
  }
}
