import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-academy-listing",
  templateUrl: "./academy-listing.component.html",
  styleUrls: ["./academy-listing.component.scss"]
})
export class AcademyListingComponent implements OnInit {
  @ViewChild("myTable") table: any;
  options = {};
  @Input() academies: any = [];
  @Output() deleteAcademy = new EventEmitter();
  @Output() editAcademy = new EventEmitter();
  columns: any = [{ prop: "Fixture" }, { name: "League" }, { name: "Team 1" }, { name: "Team 2" }];
  loadingIndicator = true;
  reorderable = true;
  ColumnMode = ColumnMode;
  public apiURL = environment.apiURL;
  constructor() {}

  ngOnInit(): void {}

  getImg = (image: string) => {
    return `${this.apiURL}/static/${image}`;
  };
  delete(id: any) {
    this.deleteAcademy.emit(id);
  }
  edit(academy: any) {
    this.editAcademy.emit(academy);
  }
}
