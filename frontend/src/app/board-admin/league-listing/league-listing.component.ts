import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { ColumnMode } from "@swimlane/ngx-datatable";

@Component({
  selector: "app-league-listing",
  templateUrl: "./league-listing.component.html",
  styleUrls: ["./league-listing.component.scss"]
})
export class LeagueListingComponent implements OnInit {
  @ViewChild("myTable") table: any;
  @Output() delLeague = new EventEmitter<string>();
  @Output() editLeague = new EventEmitter<string>();
  @Input() leaguesData: any;
  options = {};
  columns: any = [{ prop: "leagueName" }, { name: "shortcode" }, { name: "user_id" }, { name: "competition" }];
  loadingIndicator = true;
  reorderable = true;
  ColumnMode = ColumnMode;
  constructor() {}

  ngOnInit(): void {
    console.log("LeagueListingComponent", this.leaguesData);
  }
  delete(value: any) {
    this.delLeague.emit(value);
  }
  edit(value: any) {
    this.editLeague.emit(value);
  }
  getCompetitionName = (competitions: any) => {
    if (competitions) {
      competitions = Array.isArray(competitions) ? competitions : [competitions];
      return competitions.map((item: any) => item.competitionName).join(", ");
    }
  };
  getCompetitionYear = (competitions: any) => {
    if (competitions) {
      return competitions.map((item: any) => item.competitionYear).join(", ");
    }
  };
}
