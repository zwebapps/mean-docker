import { AfterViewInit, Component, Input, OnInit } from "@angular/core";
import { blogcard, blogcards } from "./blog-cards-data";
import { DashboardService } from "src/app/_services/dashbaord.service";
import { NotifierService } from "angular-notifier";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-blog-cards",
  templateUrl: "./blog-cards.component.html",
  styleUrls: ["./blog-cards.component.css"]
})
export class BlogCardsComponent implements OnInit, AfterViewInit {
  private notifier: NotifierService;
  public dashboard: any;

  blogcards: blogcard[] = [];
  apiURL = environment.apiURL;

  constructor(private dashboardService: DashboardService, notifier: NotifierService) {
    this.notifier = notifier;
  }

  ngOnInit(): void {
    this.getDashboardContents();
  }
  ngAfterViewInit(): void {}
  mapDashboardContents() {
    if (Object.keys(this.dashboard).length > 0) {
      Object.keys(this.dashboard).forEach((key) => {
        this.blogcards.push({
          title: key,
          count: this.dashboard[key].length.toString(),
          image: `${key}.svg`,
          bgcolor: "success",
          icon: "bi bi-wallet"
        });
      });
    }
  }

  getDashboardContents() {
    this.dashboardService.getDashboardContents().subscribe((res: any) => {
      if (res) {
        this.notifier.notify("success", res.message);
        this.dashboard = res.data;
        this.mapDashboardContents();
      }
    });
  }
}
