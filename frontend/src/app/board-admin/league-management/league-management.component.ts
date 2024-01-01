import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import * as LeagueSelectors from "../../_store/selectors/leagues.selectors";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NotifierService } from "angular-notifier";
import { AcademyService } from "src/app/_services/academy.service";
import { StorageService } from "src/app/_services/storage.service";
import * as LeagueActions from "../../_store/actions/leagues.actions";
// importing selectors
import { Router } from "@angular/router";
import { UserService } from "src/app/_services/user.service";
import { LeagueService } from "src/app/_services/league.service";
import { ConfirmationDialogService } from "src/app/_services/confirmation-dialog.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-league-management",
  templateUrl: "./league-management.component.html",
  styleUrls: ["./league-management.component.scss"]
})
export class LeagueManagementComponent implements OnInit {
  private notifier: NotifierService;
  leagues: any = [];
  leagueToDel: string = null;
  public editLeague: boolean = false;
  public leagueTobeEdit: any = {};
  public selectedCompetition: any = {};
  public compSettings: any = {};
  apiURL = environment.apiURL;
  maxDate: Date = new Date();
  leagueForm = new FormGroup({
    leagueName: new FormControl("", Validators.required),
    leagueAge: new FormControl("", Validators.required),
    shortCode: new FormControl("", Validators.required),
    leagueYear: new FormControl("", Validators.required)
  });

  constructor(
    private storageService: StorageService,
    notifier: NotifierService,
    private academyService: AcademyService,
    private store: Store,
    private router: Router,
    private userService: UserService,
    private leagueService: LeagueService,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    this.notifier = notifier;
    this.getCompetitions();
  }

  ngOnInit(): void {
    this.getLeaguesFromStore();
    this.leagueForm.patchValue({
      shortCode: this.selectedCompetition?.shortCode,
      leagueYear: isNaN(Number(this.selectedCompetition?.competitionYear))
        ? new Date().getFullYear()
        : this.selectedCompetition?.competitionYear
    });
    // disable year and short code
    this.leagueForm.controls.shortCode.disable();
    this.leagueForm.controls.leagueYear.disable();
  }
  getLeagueNo(leagueName: any) {
    if (leagueName) {
      let nameArray = leagueName.match(/(\d+)/);
      return nameArray ? nameArray.find((nm: any) => !isNaN(nm)) : null;
    }
  }

  getAgeFromName(leagueName: any) {
    let nameArray = leagueName.match(/(\d+)/);
    if (!nameArray) {
      this.notifier.notify("error", "League name should contain age limit!");
      return;
    }
    return nameArray.find((nm: any) => !isNaN(nm));
  }

  onSubmit() {
    const user = this.storageService.getUser();
    if (!this.editLeague) {
      if (!this.leagueForm.value.leagueName) {
        this.notifier.notify("error", "League name not provided!");
        return;
      } else {
        if (this.leagueForm.value.leagueName) {
          const leagueData = {
            "League Name": this.leagueForm.value.leagueName,
            "Age Limit": this.leagueForm.value.leagueAge,
            "Short Code": this.selectedCompetition.shortCode,
            Year: this.selectedCompetition.competitionYear,
            competition: this.selectedCompetition?._id,
            user: {
              createdBy: user._id ? user._id : user.id
            }
          };
          // update league
          this.leagueService.createLeague(leagueData).subscribe((res: any) => {
            if (res.message) {
              this.notifier.notify(res.type, res.message);
              return;
            } else {
              this.notifier.notify("success", "League created successfully!");
              this.leagueForm.reset();
              this.store.dispatch(LeagueActions.loadLeagues());
            }
          });
        }
      }
    } else {
      const leagueData = {
        "League Name": this.leagueForm.value.leagueName,
        "Age Limit": this.leagueForm.value.leagueAge,
        "Short Code": this.selectedCompetition?.shortCode,
        year: this.selectedCompetition?.competitionYear,
        competition: this.selectedCompetition._id,
        user: {
          createdBy: user._id ? user._id : user.id
        }
      };
      // check if academy exists
      this.leagueService.updateLeague(this.leagueTobeEdit._id, leagueData).subscribe((res: any) => {
        if (res.message) {
          this.notifier.notify(res.type, res.message);
          return;
        } else {
          this.notifier.notify("success", "League created successfully!");
          this.leagueForm.reset();
          this.store.dispatch(LeagueActions.loadLeagues());
        }
      });
    }
  }

  filterByName(str: any) {
    if (str) {
      this.leagues = this.leagues.filter((league: any) => league?.leagueName?.toLowerCase().includes(str?.toLowerCase()));
    } else {
      this.getLeaguesFromStore();
    }
  }
  filterByYear(str: any) {
    this.getLeaguesFromStore();
    if (str.length > 3) {
      this.leagues = this.leagues.filter((league: any) => league?.year.includes(str.toLowerCase()));
    } else {
      this.getLeaguesFromStore();
    }
  }

  onDeleteLeague(leagueId: any) {
    this.leagueToDel = leagueId;
    this.openConfirmationDialog();
  }

  onEditLeague(league: any) {
    this.editLeague = true;
    this.leagueTobeEdit = league;
    // disable year and short code
    this.leagueForm.patchValue({
      shortCode: this.selectedCompetition?.shortCode,
      leagueYear: isNaN(Number(this.selectedCompetition?.competitionYear))
        ? new Date().getFullYear()
        : this.selectedCompetition?.competitionYear,
      leagueName: league?.leagueName,
      leagueAge: league?.leagueAgeLimit
    });
    this.leagueForm.controls.shortCode.disable();
    this.leagueForm.controls.leagueYear.disable();
  }
  public openConfirmationDialog() {
    this.confirmationDialogService
      .confirm("Please confirm..", "Do you really want to ... ?")
      .then((value) => this.deleteSelection(value))
      .catch(() => console.log("User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)"));
  }

  deleteSelection(value: any) {
    if (value) {
      this.leagueService.deleteLeague(this.leagueToDel).subscribe((result: any) => {
        if (result.message) {
          this.notifier.notify("success", result.message);
          this.store.dispatch(LeagueActions.loadLeagues());
        }
      });
    }
  }
  getImg = (image: string) => {
    return `${this.apiURL}/static/${image}`;
  };
  getCompetitions() {
    this.selectedCompetition = this.storageService.getCompetition();
    if (this.selectedCompetition) {
      if (!this.selectedCompetition?.competitionSettings) {
        this.notifier.notify("error", "Competition settings not found, please add it first !");
      }
      if (this.selectedCompetition?.competitionSettings) {
        this.compSettings = JSON.parse(this.selectedCompetition?.competitionSettings);
      }
    }
  }
  getLeaguesFromStore() {
    this.store.select(LeagueSelectors.getLeagues).subscribe((leagues) => {
      if (Array.isArray(leagues)) {
        if (leagues.length > 0) {
          this.leagues = leagues.slice().sort((a, b) => {
            const aNumber = parseInt(this.getLeagueNo(a?.leagueName));
            const bNumber = parseInt(this.getLeagueNo(b?.leagueName));

            if (isNaN(aNumber) || isNaN(bNumber)) {
              return a?.leagueName?.localeCompare(b?.leagueName);
            }
            return aNumber - bNumber;
          });
          // if (this.selectedCompetition) {
          //   this.leagues = leagues.slice().filter((league) => league.shortcode === this.selectedCompetition.shortCode);
          // }
        }
      }
    });
  }
}
