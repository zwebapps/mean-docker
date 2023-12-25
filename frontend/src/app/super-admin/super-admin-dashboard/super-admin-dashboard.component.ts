import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { NotifierService } from "angular-notifier";
import { DashboardService } from "src/app/_services/dashbaord.service";
import { blogcard } from "src/app/dashboard/dashboard-components/blog-cards/blog-cards-data";
import { topcard, topcards } from "src/app/dashboard/dashboard-components/top-cards/top-cards-data";
import * as UserSelectors from "../../_store/selectors/users.selectors";
import * as TeamSelectors from "../../_store/selectors/teams.selectors";

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
        // this.notifier.notify("success", res.message);
        this.dashboardContents = res.data;
        this.mapDashboardContents();
      }
    }),
      (error: any) => {
        this.notifier.notify("error", "Try again later");
      };
  }
  mapDashboardContents() {
    debugger;
    console.log(this.filterByOptions);
    this.dashboardContents["academies"] = this.dashboardContents["academies"].filter(
      (item: any) => (this.filterByOptions.competition ? item.competition === this.filterByOptions.competition : true)

      //  else if (this.filterByOptions.ageGroup) {
      //   return item.ageGroup === this.filterByOptions.ageGroup;
      // } else if (this.filterByOptions.compYear) {
      //   return item.compYear === this.filterByOptions.compYear;
      // } else if (this.filterByOptions.gender) {
      //   return item.gender === this.filterByOptions.gender;
      // }
    );
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
