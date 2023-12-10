import { Component, Input, OnInit } from "@angular/core";
// import { DashboardService } from "src/app/_services/dashbaord.service";
// import { NotifierService } from "angular-notifier";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-blog-cards",
  templateUrl: "./blog-cards.component.html",
  styleUrls: ["./blog-cards.component.css"]
})
export class BlogCardsComponent implements OnInit {
  @Input() blogcards: any;
  @Input() dashboardContents: any;
  apiURL = environment.apiURL;

  constructor() {}

  ngOnInit(): void {}
}
