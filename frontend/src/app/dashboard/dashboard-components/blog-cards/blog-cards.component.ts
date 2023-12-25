import { Component, Input, OnInit } from "@angular/core";
import { StorageService } from "src/app/_services/storage.service";
import { environment } from "src/environments/environment";

const dashboardLabels: any = [
  {
    key: "teams",
    label: "Teams"
  },
  {
    key: "players",
    label: "Total Players"
  },
  {
    key: "academies",
    label: "Academies"
  },
  {
    key: "competitions",
    label: "Competitions"
  },
  {
    key: "fixtures",
    label: "Fixtures"
  },
  {
    key: "leagues",
    label: "Leagues"
  }
];

@Component({
  selector: "app-blog-cards",
  templateUrl: "./blog-cards.component.html",
  styleUrls: ["./blog-cards.component.css"]
})
export class BlogCardsComponent implements OnInit {
  @Input() blogcards: any;
  @Input() dashboardContents: any;
  apiURL = environment.apiURL;
  public loggedInUser: any;
  constructor(private storageService: StorageService) {
    if (this.storageService.getUser()) {
      this.loggedInUser = this.storageService.getUser();
    }
  }

  ngOnInit(): void {}
  getLabel(key: any) {
    return dashboardLabels.find((dlabel: any) => dlabel.key === key)?.label;
  }
}
