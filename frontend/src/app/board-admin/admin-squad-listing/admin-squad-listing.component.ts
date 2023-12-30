import { Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-admin-squad-listing",
  templateUrl: "./admin-squad-listing.component.html",
  styleUrls: ["./admin-squad-listing.component.scss"]
})
export class AdminSquadListingComponent {
  @ViewChild("myTable") table: any;
  @Output() squadManagement = new EventEmitter<string>();
  @Output() editAcademy = new EventEmitter<string>();
  @Input() academiesData: any;
  public apiURL = environment.apiURL;
  options = {};
  columns: any = [{ prop: "teamName" }];
  loadingIndicator = true;
  reorderable = true;
  ColumnMode = ColumnMode;
  constructor() {}

  ngOnInit(): void {
    // console.log("AdminSquadListingComponent", this.academiesData);
  }
  sqManagement(value: any) {
    this.squadManagement.emit(value);
  }
  edit(value: any) {
    this.editAcademy.emit(value);
  }
  getImg = (image: string) => {
    return `${this.apiURL}/static/${image}`;
  };
}
