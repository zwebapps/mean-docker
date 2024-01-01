import { Component } from "@angular/core";
// importing selectors
import * as AcademySelectors from "../../_store/selectors/academies.selectors";
import { Store } from "@ngrx/store";
import { NotifierService } from "angular-notifier";
import { StorageService } from "src/app/_services/storage.service";
import { AcademyService } from "src/app/_services/academy.service";
import { TeamService } from "src/app/_services/team.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-squad-management",
  templateUrl: "./squad-management.component.html",
  styleUrls: ["./squad-management.component.scss"]
})
export class SquadManagementComponent {
  private notifier: NotifierService;
  academy: any = {};
  teams: any = [];
  public academies: any = [];
  user: any;
  public selectedCompetition: any = {};
  constructor(
    private storageService: StorageService,
    notifier: NotifierService,
    private academyService: AcademyService,
    private teamService: TeamService,
    private store: Store,
    private router: Router,
    public activatedRoute: ActivatedRoute
  ) {
    this.user = this.storageService.getUser();
    this.notifier = notifier;
  }

  ngOnInit(): void {
    this.getCompetitions();
    this.getAcademiesFromStore();
  }
  redirectTo(acadmeyId: any) {
    this.router.navigate([this.user.shortcode + "/admin/squads/academy/" + acadmeyId]);
  }

  filterClubs(event: any) {
    if (event) {
      this.academies = this.academies.filter((academy: any) => academy?.academyName?.toLowerCase().includes(event.toLowerCase()));
    } else {
      this.getAcademiesFromStore();
    }
  }
  getAcademiesFromStore() {
    this.store.select(AcademySelectors.getAcademies).subscribe((academy) => {
      if (academy) {
        this.academies = academy.slice().sort((a, b) => {
          const aNumber = parseInt(a?.academyName.split(" ")[1]);
          const bNumber = parseInt(b?.academyName.split(" ")[1]);

          if (isNaN(aNumber) || isNaN(bNumber)) {
            return a?.academyName?.localeCompare(b?.academyName);
          }
          return aNumber - bNumber;
        });
      }
      if (this.selectedCompetition) {
        this.academies = academy.slice().filter((academy: any) => academy.shortcode === this.selectedCompetition.shortCode);
      }
    });
  }
  getCompetitions() {
    this.selectedCompetition = this.storageService.getCompetition();
  }
}
