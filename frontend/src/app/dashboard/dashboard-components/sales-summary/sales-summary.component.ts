import { Component, Input, OnChanges, OnInit, ViewChild } from "@angular/core";
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
  selector: "app-sales-summary",
  templateUrl: "./sales-summary.component.html"
})
export class SalesSummaryComponent implements OnInit, OnChanges {
  @Input() dashboardContents = {};
  @Input() blogcards = {};
  @ViewChild("chart") chart: ChartComponent = Object.create(null);
  @Input({ required: false }) academy: any = null;
  public salesChartOptions: Partial<salesChartOptions>;
  public barCharOptions: any;
  public pieChartOptions: any;
  public donutChartOptions: any;
  public teamsdata = {
    counting: [],
    labels: []
  };
  public academiesData = {
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

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.getDashboardContents();
  }
  ngAfterViewInit() {}
  ngOnChanges() {}
  getDashboardContents() {
    this.dashboardService.getDashboardContents().subscribe((res: any) => {
      if (res) {
        if (this.academy) {
          this.dashboardContents = res.data;
          this.dashboardContents["teams"] = res.data["teams"].filter((team: any) => team?.academy_id?._id === this.academy._id);
        } else {
          this.dashboardContents = res.data;
        }
        this.mapDashboardCharts(this.dashboardContents);
      }
    });
  }

  mapDashboardCharts(chartsContents: any) {
    if (chartsContents["teams"]) {
      chartsContents["teams"].forEach((team: any) => {
        this.teamsdata.counting.push(team.count), this.teamsdata.labels.push(team.teamName);
      });
      // add data for graph
      this.barCharOptions = {
        series: [
          {
            name: "No. of Associated Leagus",
            data: [...this.teamsdata.counting]
          }
        ],
        annotations: {
          points: [
            {
              x: "Teams",
              seriesIndex: 0,
              label: {
                borderColor: "#775DD0",
                offsetY: 0,
                style: {
                  color: "#fff",
                  background: "#775DD0"
                },
                text: "Registered Teams with different leagues"
              }
            }
          ]
        },
        chart: {
          height: 350,
          type: "bar"
        },
        plotOptions: {
          bar: {
            borderRadius: 10,
            columnWidth: "50%"
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: 2
        },

        grid: {
          row: {
            colors: ["#fff", "#f2f2f2"]
          }
        },
        xaxis: {
          labels: {
            rotate: -45
          },
          categories: [...this.teamsdata.labels],
          tickPlacement: "on"
        },
        yaxis: {
          title: {
            text: "Registered Teams"
          }
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "light",
            type: "horizontal",
            shadeIntensity: 0.25,
            gradientToColors: undefined,
            inverseColors: true,
            opacityFrom: 0.85,
            opacityTo: 0.85,
            stops: [50, 0, 100]
          }
        }
      };
      this.pieChartOptions = {
        series: [...this.teamsdata.counting],
        chart: {
          width: 500,
          type: "pie"
        },
        labels: [...this.teamsdata.labels],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: "bottom"
              }
            }
          }
        ]
      };
    }
    // for acadmeis
    if (chartsContents["academies"]) {
      chartsContents["teams"].forEach((team: any) => {
        this.academiesData.counting.push(team.count), this.teamsdata.labels.push(team.teamName);
      });
      this.salesChartOptions = {
        series: [
          {
            name: "Iphone 13",
            data: [0, 31, 40, 28, 51, 42, 109, 100]
          },
          {
            name: "Oneplue 9",
            data: [0, 11, 32, 45, 32, 34, 52, 41]
          }
        ],
        chart: {
          fontFamily: "Nunito Sans,sans-serif",
          height: 350,
          type: "area",
          toolbar: {
            show: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "smooth",
          width: "1"
        },
        grid: {
          strokeDashArray: 3
        },
        xaxis: {
          categories: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug"]
        },
        tooltip: {
          theme: "dark"
        }
      };
    }
    this.donutChartOptions = {
      series: [44, 55, 41, 17, 15],
      chart: {
        width: 560,
        height: 360,
        type: "donut"
      },
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 270
        }
      },
      dataLabels: {
        enabled: false
      },
      fill: {
        type: "gradient"
      },
      legend: {
        formatter: function (val, opts) {
          return val + " - " + opts.w.globals.series[opts.seriesIndex];
        }
      },
      title: {
        text: "Gradient Donut with custom Start-angle"
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 250
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }
}
