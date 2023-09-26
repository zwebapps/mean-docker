import { Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { UserService } from "src/app/_services/user.service";
import * as PlayerSelectors from "../../_store/selectors/players.selectors";

@Component({
  selector: "app-referee-squad-listing",
  templateUrl: "./referee-squad-listing.component.html",
  styleUrls: ["./referee-squad-listing.component.scss"]
})
export class RefereeSquadListingComponent {
  @ViewChild("myTable") table: any;
  @Output() delPlayer = new EventEmitter<string>();
  @Output() fixtureDetail = new EventEmitter<string>();
  @Output() delFixture = new EventEmitter<string>();
  options = {};
  @Input() fixtures: any = [];
  columns: any = [{ prop: "Fixture" }, { name: "League" }, { name: "Team 1" }, { name: "Team 2" }];
  loadingIndicator = true;
  reorderable = true;
  ColumnMode = ColumnMode;
  constructor(private store: Store, private userService: UserService) {}

  ngOnInit() {}

  edit(value: any) {
    // this.userService.deleteUser(value).subscribe((result:any)  => {
    console.log(value);
    // })
  }

  delete(value: any) {
    this.delPlayer.emit(value);
  }

  toggleExpandRow(row: any) {
    this.fixtureDetail.emit(row);
    this.table.rowDetail.toggleExpandRow(row);
  }

  deleteFixture(value: any) {
    this.delFixture.emit(value);
  }
  onDetailToggle(event: any) {
    console.log("Detail Toggled", event);
  }
}
