import { Component, Input } from "@angular/core";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-academy-header",
  templateUrl: "./academy-header.component.html",
  styleUrls: ["./academy-header.component.scss"]
})
export class AcademyHeaderComponent {
  @Input() academy: any;
  @Input({ required: false }) team: any;
  apiURL = environment.apiURL;
  constructor() {}

  getImg = (image: string) => {
    return `${this.apiURL}/static/${image}`;
  };
}
