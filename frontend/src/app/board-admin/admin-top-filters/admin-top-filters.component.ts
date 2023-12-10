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
  filterCompetitions(event: any) {
    this.competitionsOut.emit();
  }
  ageGroup(event: any) {
    this.ageGroupOut.emit();
  }
  compYear(event: any) {
    this.compYearOut.emit();
  }
  gender(event: any) {
    this.genderOut.emit();
  }
}
