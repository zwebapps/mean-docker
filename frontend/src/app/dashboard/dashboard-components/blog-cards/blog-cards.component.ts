import { Component, Input, OnInit } from "@angular/core";
import { StorageService } from "src/app/_services/storage.service";
// import { DashboardService } from "src/app/_services/dashbaord.service";
// import { NotifierService } from "angular-notifier";
import { environment } from "src/environments/environment";

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
}
