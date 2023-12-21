import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { environment } from "src/environments/environment";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { Country, Countries } from "src/app/_shared/countries.data";

@Component({
  selector: "app-competition",
  templateUrl: "./competition.component.html",
  styleUrls: ["./competition.component.scss"]
})
export class CompetitionComponent implements OnInit {
  @ViewChild("myTable") table: any;

  countries: Country[] = [];
  options = {};
  columns: any = [{ prop: "firstname" }, { name: "lastname" }, { name: "username" }, { name: "email" }];
  loadingIndicator = true;
  reorderable = true;
  ColumnMode = ColumnMode;
  @Output() delCompetition: EventEmitter<any> = new EventEmitter();
  @Output() editComp: EventEmitter<any> = new EventEmitter();
  @Input() competitions: any = [];
  @Input() users: any = [];
  apiURL = environment.apiURL;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.getCountries();
  }

  getDescription(data: any) {
    return JSON.parse(data)?.competitionDescription || "No Description provided";
  }
  getOrganiser(data: any) {
    return JSON.parse(data)?.organiserName || "No Organiser provided";
  }
  getSantizedpopUpUrl = (image: any) => {
    const logoUrl = `${this.apiURL}/static/${image}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(logoUrl);
  };
  deleteCompetition(competition: any) {
    const { _id } = competition;
    console.log(_id);
    this.delCompetition.emit(_id);
  }
  editCompetition(competition: any) {
    console.log(competition);
    this.editComp.emit(competition);
  }
  getOrganiserDetail(details: any) {
    if (details) {
      return JSON.parse(details);
    }
  }
  getCountries() {
    this.countries = Countries;
  }
}
