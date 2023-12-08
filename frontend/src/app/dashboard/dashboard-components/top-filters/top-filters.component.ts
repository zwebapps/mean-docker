import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: "app-top-filters",
  templateUrl: "./top-filters.component.html",
  styleUrls: ["./top-filters.component.scss"]
})
export class TopFiltersComponent implements OnInit {
  @Input() dashbordContents: any = {};
  @Output() competitionsOut = new EventEmitter();
  @Output() ageGroupOut = new EventEmitter();
  @Output() compYearOut = new EventEmitter();
  @Output() genderOut = new EventEmitter();
  topFilterForm: FormGroup;
  constructor() {}

  ngOnInit(): void {
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
