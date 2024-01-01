import { Component, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { NotifierService } from "angular-notifier";
import { AcademyService } from "src/app/_services/academy.service";
import { StorageService } from "src/app/_services/storage.service";
import { TeamService } from "src/app/_services/team.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-coach-squad-management",
  templateUrl: "./coach-squad-management.component.html",
  styleUrls: ["./coach-squad-management.component.scss"]
})
export class CoachSquadManagementComponent implements OnInit {
  @ViewChild("myTable") table: any;
  options = {};
  columns: any = [{ prop: "firstname" }, { name: "lastname" }, { name: "username" }, { name: "email" }];
  loadingIndicator = true;
  reorderable = true;
  ColumnMode = ColumnMode;
  private notifier: NotifierService;
  private loggedInCoach: any = {};
  public academy: any;
  public teams: any = [];
  apiURL = environment.apiURL;
  public filters: string[] = [];
  constructor(
    private academyService: AcademyService,
    private teamService: TeamService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private storagService: StorageService,
    notifier: NotifierService
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
        const mappedTeams: any = [];
        // map team based on age group
        res.forEach((team: any) => {
          const { academy_id, competition, leagues, shortcode, teamName, user_id, _id } = team;
          leagues.forEach((league: any) => {
            mappedTeams.push({
              academy_id,
              competition,
              league: league,
              shortcode,
              teamName,
              user_id,
              _id
            });
          });
        });
        this.teams = mappedTeams;
      }
    });
  }
  filterTeams(event: any) {
    if (event) {
      this.teams = this.teams.filter((tm: any) => tm?.league?.leagueName?.toLowerCase().includes(event.toLowerCase()));
    } else {
      this.getTeamsByAcademy(this.academy._id);
    }
  }
  onTeamClick(team: any) {
    // navigate to squad
    this.storagService.setTeam(team);
    this.router.navigate([`${this.loggedInCoach.shortcode}/coach/squads/${team._id}`]);
  }
  getImg = (image: string) => {
    return `${this.apiURL}/static/${image}`;
  };
  removeFilter(filter: string) {
    this.filters = this.filters.filter((f) => f !== filter);
  }
  addFilter(filter: string) {
    if (!this.filters.includes(filter)) {
      this.filters.push(filter);
    }
  }
}
