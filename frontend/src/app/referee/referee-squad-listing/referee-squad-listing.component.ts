import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { UserService } from "src/app/_services/user.service";
import * as PlayerSelectors from "../../_store/selectors/players.selectors";
import { FixtureService } from "src/app/_services/fixture.service";
import { NotifierService } from "angular-notifier";

@Component({
  selector: "app-referee-squad-listing",
  templateUrl: "./referee-squad-listing.component.html",
  styleUrls: ["./referee-squad-listing.component.scss"]
})
export class RefereeSquadListingComponent implements OnInit, OnChanges {
  @ViewChild("myTable") table: any;
  @Output() delPlayer = new EventEmitter<string>();
  @Output() fixtureDetail = new EventEmitter<string>();
  @Output() delFixture = new EventEmitter<string>();
  @Output() editFixture = new EventEmitter();
  private notifier: NotifierService;
  options = {};
  fixtureEdited = {
    homeTeamGoals: 0,
    awayTeamGoals: 0
  };
  @Input() fixtures: any = [];
  public fixtureProvided: any = [];
  columns: any = [{ prop: "Fixture" }, { name: "League" }, { name: "Team 1" }, { name: "Team 2" }];
  loadingIndicator = true;
  reorderable = true;
  ColumnMode = ColumnMode;
  isEditable = {};
  fixtureUpdatedGoals = {};
  constructor(notifier: NotifierService, private store: Store, private userService: UserService, private fixtureService: FixtureService) {
    notifier = notifier;
  }

  ngOnInit() {
    this.fixtureProvided = this.fixtures;
  }
  ngOnChanges() {
    this.fixtureProvided = this.fixtures;
  }

  edit(value: any) {
    // this.userService.deleteUser(value).subscribe((result:any)  => {
    console.log(value);
    // })
  }
  // Save row
  save(row: any, rowIndex: any) {
    console.log("Row saved: " + rowIndex, row, this.fixtureUpdatedGoals[rowIndex]);
    const fixtureObj = {
      _id: row._id,
      ...this.fixtureUpdatedGoals[rowIndex]
    };
    this.editFixture.emit(fixtureObj);
    // this.isEditable[rowIndex] = !this.isEditable[rowIndex];
  }

  addGoals($event: any, rowIndex: any, teamType: any) {
    const value = $event.target.value;
    if (value) {
      if (!this.fixtureUpdatedGoals[rowIndex]) {
        this.fixtureUpdatedGoals[rowIndex] = {};
      }
      this.fixtureUpdatedGoals[rowIndex][teamType] = value;
    }
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
