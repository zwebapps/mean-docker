import { Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { ColumnMode } from "@swimlane/ngx-datatable";

@Component({
  selector: "app-admin-team-listing",
  templateUrl: "./admin-team-listing.component.html",
  styleUrls: ["./admin-team-listing.component.scss"]
})
export class AdminTeamListingComponent {
  @ViewChild("myTable") table: any;
  @Output() delTeam = new EventEmitter<string>();
  @Output() editTeam = new EventEmitter<string>();
  @Input() teamsData: any;
  options = {};
  columns: any = [{ prop: "teamName" }];
  loadingIndicator = true;
  reorderable = true;
  ColumnMode = ColumnMode;
  constructor() {}

  ngOnInit(): void {
    console.log("AdminTeamListingComponent", this.teamsData);
  }
  delete(value: any) {
    this.delTeam.emit(value);
  }
  edit(value: any) {
    this.editTeam.emit(value);
  }
  getCompetitionName = (competitions: any) => {
    if (competitions) {
      return competitions.map((item: any) => item.competitionName).join(", ");
    }
  };
  getCompetitionYear = (competitions: any) => {
    if (competitions) {
      return competitions.map((item: any) => item.competitionYear).join(", ");
    }
  };
}
