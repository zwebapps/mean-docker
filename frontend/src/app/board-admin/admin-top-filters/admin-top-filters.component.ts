import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { DashboardService } from "src/app/_services/dashbaord.service";

@Component({
  selector: "app-admin-top-filters",
  templateUrl: "./admin-top-filters.component.html",
  styleUrls: ["./admin-top-filters.component.scss"]
})
export class AdminTopFiltersComponent implements OnInit {
  @Output() competitionsOut = new EventEmitter();
  @Output() ageGroupOut = new EventEmitter();
  @Output() compYearOut = new EventEmitter();
  @Output() genderOut = new EventEmitter();
  public dashboardContents: any;
  topFilterForm: FormGroup;
  constructor(private dashboardService: DashboardService) {
    this.topFilterForm = new FormGroup({
      competition: new FormControl(""),
      ageGroup: new FormControl(""),
      compYear: new FormControl(""),
      gender: new FormControl("")
    });
  }
  ngOnInit(): void {
    this.getDashboardContents();
  }
  filterByCompetitions(event: any) {
    const competition: any = event.target.value;
    this.competitionsOut.emit({ competition: competition });
  }
  filterByAgeGroup(event: any) {
    const ageGroup: any = event.target.value;
    this.ageGroupOut.emit({ ageGroup: ageGroup });
  }
  filterByYear(event: any) {
    const year: any = event.target.value;
    this.compYearOut.emit({ compYear: year });
  }
  filterByGender(event: any) {
    const gender: any = event.target.value;
    // console.log(event);
    this.genderOut.emit({ gender: gender });
  }
  getDashboardContents() {
    this.dashboardService.getDashboardContents().subscribe((res: any) => {
      if (res) {
        this.dashboardContents = res.data;
      }
    }),
      (error: any) => {
        console.log(error);
      };
  }
}
