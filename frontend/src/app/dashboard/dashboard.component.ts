import { Component, AfterViewInit } from "@angular/core";
//declare var require: any;

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements AfterViewInit {
  subtitle: string;
  constructor() {
    this.subtitle = "This is some text within a card block.";
  }

  ngAfterViewInit() {}
}
