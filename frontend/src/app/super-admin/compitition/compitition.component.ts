import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-compitition",
  templateUrl: "./compitition.component.html",
  styleUrls: ["./compitition.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompititionComponent implements OnInit {
  @Output() delCompitition: EventEmitter<any> = new EventEmitter();
  @Output() editComp: EventEmitter<any> = new EventEmitter();
  @Input() compititions: any = [];
  apiURL = environment.apiURL;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {}
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
}
