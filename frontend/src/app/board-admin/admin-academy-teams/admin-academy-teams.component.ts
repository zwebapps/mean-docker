import { Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-admin-academy-teams",
  templateUrl: "./admin-academy-teams.component.html",
  styleUrls: ["./admin-academy-teams.component.scss"]
})
export class AdminAcademyTeamsComponent {
  @ViewChild("myTable") table: any;
  @Output() squadManagement = new EventEmitter<string>();
  @Output() academyRedirect = new EventEmitter<string>();
  @Input() teamsData: any;
  public apiURL = environment.apiURL;
  options = {};
  columns: any = [{ prop: "teamName" }];
  loadingIndicator = true;
  reorderable = true;
  ColumnMode = ColumnMode;
  constructor() {}

  ngOnInit(): void {
    console.log("AdminSquadListingComponent", this.teamsData);
  }
  sqManagement(value: any) {
    this.squadManagement.emit(value);
  }
  // edit(value: any) {
  //   this.editAcademy.emit(value);
  // }
  getImg = (image: string) => {
    return `${this.apiURL}/static/${image}`;
  };
  redirectAcademySquady(id: any) {
    this.academyRedirect.emit(id);
  }
}
