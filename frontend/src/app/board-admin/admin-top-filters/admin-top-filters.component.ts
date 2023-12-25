import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: "app-admin-top-filters",
  templateUrl: "./admin-top-filters.component.html",
  styleUrls: ["./admin-top-filters.component.scss"]
})
export class AdminTopFiltersComponent {
  @Input() dashboardContents: any;
  @Output() competitionsOut = new EventEmitter();
  @Output() ageGroupOut = new EventEmitter();
  @Output() compYearOut = new EventEmitter();
  @Output() genderOut = new EventEmitter();
  topFilterForm: FormGroup;
  constructor() {
    this.topFilterForm = new FormGroup({
      competition: new FormControl(""),
      ageGroup: new FormControl(""),
      compYear: new FormControl(""),
      gender: new FormControl("")
    });
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
}
