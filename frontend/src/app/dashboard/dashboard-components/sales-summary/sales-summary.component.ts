import { Component, Input, OnInit } from "@angular/core";
import { single } from "../../../login/data";

@Component({
  selector: "app-sales-summary",
  templateUrl: "./sales-summary.component.html"
})
export class SalesSummaryComponent implements OnInit {
  @Input() dashboardContents = {};
  @Input() blogcards = {};
  @Input({ required: false }) academy: any = null;
  @Input() academiesData: any[] = [];
  chartData: any[];
  multi: any[];

  // options bar chart
  width: number = 700;
  height: number = 300;
  fitContainer: boolean = false;

  view: any[] = [1400, 500];
  // options for the chart
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = "Academies";
  showYAxisLabel = true;
  yAxisLabel = "Registered Teams";
  timeline = true;
  doughnut = true;
  colorScheme = {
    domain: ["#9370DB", "#87CEFA", "#FA8072", "#FF7F50", "#90EE90", "#9370DB"]
  };
  //pie
  showLabels = true;

  // options pie chart
  isDoughnut: boolean = true;
  arcWidth: number = 0.4;
  legendPosition: string = "below";
  public barCharOptions: any;
  public pieChartOptions: any;
  public donutChartOptions: any;

  public teamsdata = {
    counting: [],
    labels: []
  };

  public playersData = {
    counting: [],
    labels: []
  };

  public fixturesData = {
    counting: [],
    labels: []
  };

  constructor() {
    this.chartData = single;
    Object.assign(this, { single });
  }

  ngOnInit(): void {
    this.chartData = single;
    Object.assign(this, { single });
  }

  onSelect(data): void {
    console.log("Item clicked", JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log("Activate", JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log("Deactivate", JSON.parse(JSON.stringify(data)));
  }
}
