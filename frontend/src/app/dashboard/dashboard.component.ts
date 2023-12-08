import { Component, AfterViewInit, OnInit } from "@angular/core";
import { DashboardService } from "../_services/dashbaord.service";
import { NotifierService } from "angular-notifier";
import { blogcard } from "../../app/dashboard/dashboard-components/blog-cards/blog-cards-data";
//declare var require: any;

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit, AfterViewInit {
  private notifier: NotifierService;
  public dashbordContents: any = {};
  blogcards: blogcard[] = [];
  constructor(private dashboardService: DashboardService, notifier: NotifierService) {
    this.notifier = notifier;
  }

  ngOnInit() {
    this.getDashboardContents();
  }

  ngAfterViewInit() {}
  getDashboardContents() {
    this.dashboardService.getDashboardContents().subscribe((res: any) => {
      if (res) {
        this.notifier.notify("success", res.message);
        this.dashbordContents = res.data;
        this.mapDashboardContents();
      }
    });
  }
  mapDashboardContents() {
    if (Object.keys(this.dashbordContents).length > 0) {
      Object.keys(this.dashbordContents).forEach((key) => {
        this.blogcards.push({
          title: key,
          count: this.dashbordContents[key].length.toString(),
          image: `${key}.svg`,
          bgcolor: "success",
          icon: "bi bi-wallet"
        });
      });
    }
  }
}
