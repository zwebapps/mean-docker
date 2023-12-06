import { Component, AfterViewInit, OnInit } from "@angular/core";
import { DashboardService } from "../_services/dashbaord.service";
import { NotifierService } from "angular-notifier";
//declare var require: any;

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit, AfterViewInit {
  private notifier: NotifierService;
  public dashbordContents: any = {};
  constructor(private dashboardService: DashboardService, notifier: NotifierService) {
    this.notifier = notifier;
  }

  ngOnInit() {}

  ngAfterViewInit() {}
}
