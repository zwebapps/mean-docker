import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { NotifierService } from "angular-notifier";
import { DashboardService } from "src/app/_services/dashbaord.service";
import { blogcard } from "src/app/dashboard/dashboard-components/blog-cards/blog-cards-data";
import { topcard, topcards } from "src/app/dashboard/dashboard-components/top-cards/top-cards-data";
import * as UserSelectors from "../../_store/selectors/users.selectors";
import * as TeamSelectors from "../../_store/selectors/teams.selectors";
import * as moment from "moment";

@Component({
  selector: "app-super-admin-dashboard",
  templateUrl: "./super-admin-dashboard.component.html",
  styleUrls: ["./super-admin-dashboard.component.scss"]
})
export class SuperAdminDashboardComponent implements OnInit {
  private notifier: NotifierService;
  public dashboardContents: any = {};
  blogcards: blogcard[] = [];
  topcards: topcard[];
  users: any = [];
  teams: any = [];
  public filterByOptions: any = {
    competition: null,
    ageGroup: null,
    compYear: null,
    gender: null
  };
  constructor(private store: Store, private dashboardService: DashboardService, notifier: NotifierService) {
    this.notifier = notifier;
    this.topcards = topcards;
  }

  ngOnInit(): void {
    // select to get user from store
    this.store.select(UserSelectors.getUsers).subscribe((users) => {
      this.users = users;
    });

    this.store.select(TeamSelectors.getTeams).subscribe((teams) => {
      this.teams = teams;
    });

    this.getDashboardContents();
  }
  getDashboardContents() {
    this.dashboardService.getDashboardContents().subscribe((res: any) => {
      if (res) {
        this.dashboardContents = res.data;
        this.mapDashboardContents();
      }
    }),
      (error: any) => {
        this.notifier.notify("error", "Try again later");
      };
  }
  getAge(dob: string) {
    const startDate: any = new Date();
    const endDate: any = new Date(dob);
    return Math.abs(moment.duration(endDate - startDate).years());
  }
  mapDashboardContents() {
    this.blogcards = [];
    if (this.filterByOptions.competition) {
      this.dashboardContents["academies"] = this.dashboardContents["academies"].filter((item: any) =>
        this.filterByOptions.competition ? item.competition === this.filterByOptions.competition : true
      );
      this.dashboardContents["players"] = this.dashboardContents["players"].filter((item: any) =>
        this.filterByOptions.competition ? item.competition && item.competition._id === this.filterByOptions.competition : true
      );

      this.dashboardContents["competitions"] = this.dashboardContents["competitions"].filter((item: any) =>
        this.filterByOptions.competition ? item._id === this.filterByOptions.competition : true
      );

      this.dashboardContents["teams"] = this.dashboardContents["teams"].filter((item: any) =>
        this.filterByOptions.competition ? item.competition === this.filterByOptions.competition : true
      );
    }

    if (this.filterByOptions.gender) {
      this.dashboardContents["players"] = this.dashboardContents["players"].filter((item: any) =>
        this.filterByOptions.gender ? item.gender && item.gender === this.filterByOptions.gender : true
      );
    }

    if (this.filterByOptions.compYear) {
      this.dashboardContents["competitions"] = this.dashboardContents["competitions"].filter((item: any) =>
        this.filterByOptions.compYear ? item.competitionYear && item.competitionYear === this.filterByOptions.compYear : true
      );
    }

    if (this.filterByOptions.ageGroup) {
      this.dashboardContents["players"] = this.dashboardContents["players"].filter((item: any) =>
        this.filterByOptions.ageGroup ? item.dob && this.getAge(item.dob) == this.filterByOptions.ageGroup : true
      );
    }

    if (Object.keys(this.dashboardContents).length > 0) {
      Object.keys(this.dashboardContents).forEach((key) => {
        this.blogcards.push({
          title: key,
          count:
            key == "teams"
              ? this.dashboardContents[key].reduce((sum: any, team: any) => sum + team.count, 0)
              : this.dashboardContents[key].length.toString(),
          image: `${key}.svg`,
          bgcolor: "success",
          icon: "bi bi-wallet"
        });
      });
    }
  }
  handleFilterByCompetitions(event: any) {
    this.filterByOptions = {
      ...this.filterByOptions,
      ...event
    };
    this.getDashboardContents();
  }
  handleFilterByAgeGroup(event: any) {
    this.filterByOptions = {
      ...this.filterByOptions,
      ...event
    };
    this.getDashboardContents();
  }
  handleFilterByYear(event: any) {
    this.filterByOptions = {
      ...this.filterByOptions,
      ...event
    };
    this.getDashboardContents();
  }
  handleFilterByGender(event: any) {
    this.filterByOptions = {
      ...this.filterByOptions,
      ...event
    };
    this.getDashboardContents();
  }
}
