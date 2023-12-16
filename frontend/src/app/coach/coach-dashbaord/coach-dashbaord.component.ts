import { Component, Input, OnChanges, OnInit, ViewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import * as PlayerSelectors from "../../_store/selectors/players.selectors";
import * as TeamSelectors from "../../_store/selectors/teams.selectors";
import { ActivatedRoute } from "@angular/router";
import { StorageService } from "src/app/_services/storage.service";
import { AcademyService } from "src/app/_services/academy.service";
import { TeamService } from "src/app/_services/team.service";
import { environment } from "src/environments/environment";
import { NotifierService } from "angular-notifier";

import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexYAxis,
  ApexLegend,
  ApexXAxis,
  ApexTooltip,
  ApexTheme,
  ApexGrid
} from "ng-apexcharts";
import { DashboardService } from "src/app/_services/dashbaord.service";

export type salesChartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  xaxis: ApexXAxis | any;
  yaxis: ApexYAxis | any;
  stroke: any;
  theme: ApexTheme | any;
  tooltip: ApexTooltip | any;
  dataLabels: ApexDataLabels | any;
  legend: ApexLegend | any;
  colors: string[] | any;
  markers: any;
  grid: ApexGrid | any;
};

@Component({
  selector: "app-coach-dashbaord",
  templateUrl: "./coach-dashbaord.component.html",
  styleUrls: ["./coach-dashbaord.component.scss"]
})
export class CoachDashbaordComponent implements OnInit {
  public dashboardContents: any = {};
  public blogcards: any = [];
  private notifier: NotifierService;
  players: any = [];
  teams: any = [];
  loggedInCoach: any;
  academy: any;
  apiURL = environment.apiURL;
  constructor(
    private dashboardService: DashboardService,
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
    if (this.loggedInCoach && this.loggedInCoach.roles.includes("ROLE_COACH")) {
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
    this.getDashboardContents();
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

  getDashboardContents() {
    this.dashboardService.getDashboardContents().subscribe((res: any) => {
      if (res) {
        // this.notifier.notify("success", res.message);
        this.dashboardContents = res.data;
        this.mapDashboardContents();
      }
    });
  }
  mapDashboardContents() {
    if (Object.keys(this.dashboardContents).length > 0) {
      Object.keys(this.dashboardContents).forEach((key) => {
        this.blogcards.push({
          title: key,
          count: this.dashboardContents[key].length.toString(),
          image: `${key}.svg`,
          bgcolor: "success",
          icon: "bi bi-wallet"
        });
      });
    }
  }
}
