import { Component, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { NotifierService } from "angular-notifier";
import { AcademyService } from "src/app/_services/academy.service";
import { StorageService } from "src/app/_services/storage.service";
import { TeamService } from "src/app/_services/team.service";
import * as TeamSelectors from "../../_store/selectors/teams.selectors";
import { environment } from "src/environments/environment";
import { Store } from "@ngrx/store";

@Component({
  selector: "app-coach-squad-management",
  templateUrl: "./coach-squad-management.component.html",
  styleUrls: ["./coach-squad-management.component.scss"]
})
export class CoachSquadManagementComponent implements OnInit {
  @ViewChild("myTable") table: any;
  public dropdownList: any = ["Team", "League"];
  dropdownObj: any = {
    Team: [],
    League: []
  };
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
  public selectedLeagues: any = [];
  public selectedTeams: any = [];
  constructor(
    private store: Store,
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
        this.getTeamsByAcademyOnRender(res._id);
      }
    });
  }
  ngOnInit(): void {}
  getTeamsByAcademyOnRender(academyId: string) {
    const mappedTeams: any = [];
    this.store.select(TeamSelectors.getTeams).subscribe((teams) => {
      let fetchedTeams = teams;
      fetchedTeams = fetchedTeams.filter((stm) => stm?.academy_id?._id === academyId);
      // map team based on age group
      fetchedTeams.forEach((team: any) => {
        const { academy_id, competition, leagues, shortcode, teamName, user_id, _id } = team;
        leagues.forEach((league: any) => {
          // check if exits already
          if (!this.dropdownObj["League"].find((lg: any) => lg?._id === league?._id)) {
            this.dropdownObj["League"].push(league);
          }
          // check if exits already
          if (!this.dropdownObj["Team"].find((tm: any) => tm?._id === _id)) {
            this.dropdownObj["Team"].push({
              academy_id,
              competition,
              league: league,
              shortcode,
              teamName,
              user_id,
              _id
            });
          }
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
      // filter based on teams and leagues
      if (this.selectedTeams.length > 0) {
        this.teams = this.teams.filter((tm: any) => this.selectedTeams.includes(tm?._id));
      }
      if (this.selectedLeagues.length > 0) {
        this.teams = this.teams.filter((tm: any) => this.selectedLeagues.includes(tm?.league?._id));
      }
    });
  }
  getTeamsByAcademy(academyId: string) {
    const mappedTeams: any = [];
    this.store.select(TeamSelectors.getTeams).subscribe((teams) => {
      let fetchedTeams = teams;
      fetchedTeams = fetchedTeams.filter((stm) => stm?.academy_id?._id === academyId);
      // map team based on age group
      fetchedTeams.forEach((team: any) => {
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
      // filter based on teams and leagues
      if (this.selectedTeams.length > 0) {
        this.teams = this.teams.filter((tm: any) => this.selectedTeams.includes(tm?._id));
      }
      if (this.selectedLeagues.length > 0) {
        this.teams = this.teams.filter((tm: any) => this.selectedLeagues.includes(tm?.league?._id));
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
    if (filter === "Team") {
      this.selectedTeams = [];
    }
    if (filter === "League") {
      this.selectedLeagues = [];
    }
    this.getTeamsByAcademy(this.academy?._id);
  }

  addFilter(filter: string) {
    if (!this.filters.includes(filter)) {
      this.filters.push(filter);
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
    this.getTeamsByAcademy(this.academy?._id);
  }
}
