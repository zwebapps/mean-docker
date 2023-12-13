import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { environment } from "src/environments/environment";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { Country, Countries } from "src/app/_shared/countries.data";

@Component({
  selector: "app-compitition",
  templateUrl: "./compitition.component.html",
  styleUrls: ["./compitition.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompititionComponent implements OnInit {
  @ViewChild("myTable") table: any;

  countries: Country[] = [];
  options = {};
  columns: any = [{ prop: "firstname" }, { name: "lastname" }, { name: "username" }, { name: "email" }];
  loadingIndicator = true;
  reorderable = true;
  ColumnMode = ColumnMode;
  @Output() delCompitition: EventEmitter<any> = new EventEmitter();
  @Output() editComp: EventEmitter<any> = new EventEmitter();
  @Input() compititions: any = [];
  apiURL = environment.apiURL;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.getCountries();
  }

  getDescription(data: any) {
    return JSON.parse(data)?.compititionDescription || "No Description provided";
  }
  getOrganiser(data: any) {
    return JSON.parse(data)?.organiserName || "No Organiser provided";
  }
  getSantizedpopUpUrl = (image: any) => {
    const logoUrl = `${this.apiURL}/static/${image}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(logoUrl);
  };
  deleteCompitition(compitition: any) {
    const { _id } = compitition;
    console.log(_id);
    this.delCompitition.emit(_id);
  }
  editCompitition(compitition: any) {
    console.log(compitition);
    this.editComp.emit(compitition);
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
