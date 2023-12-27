import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { NotifierService } from "angular-notifier";
import { AcademyService } from "src/app/_services/academy.service";
import { StorageService } from "src/app/_services/storage.service";
import * as AcademyActions from "../../_store/actions/academies.actions";
// importing selectors
import * as AcademySelectors from "../../_store/selectors/academies.selectors";
import { Store } from "@ngrx/store";
import { Router } from "@angular/router";

// importing actions
import * as UserActions from "../../_store/actions/users.actions";
import { UserService } from "src/app/_services/user.service";
import { ConfirmationDialogService } from "src/app/_services/confirmation-dialog.service";
import { PlayerService } from "src/app/_services/player.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-team-management",
  templateUrl: "./team-management.component.html",
  styleUrls: ["./team-management.component.scss"]
})
export class TeamManagementComponent implements OnInit {
  user: any;
  private notifier: NotifierService;
  public academies: any = [];
  public academyToDel: any = [];
  public academyLogo: any;
  public editAcademy: boolean = false;
  public academyToEdit: string = null;
  public selectedCompetition: any = {};
  public compSettings: any = {};
  public apiURL = environment.apiURL;
  public displayTeamForm: boolean = false;
  academyForm = new FormGroup({
    academyName: new FormControl(""),
    academyLogo: new FormControl(""),
    academyColor: new FormControl(""),
    coachName: new FormControl(""),
    userName: new FormControl(""),
    password: new FormControl(""),
    emailAddress: new FormControl(""),
    mobileNumber: new FormControl("")
  });

  constructor(
    private storageService: StorageService,
    private confirmationDialogService: ConfirmationDialogService,
    notifier: NotifierService,
    private academyService: AcademyService,
    private store: Store,
    private router: Router,
    private userService: UserService,
    private palyerService: PlayerService
  ) {
    this.user = this.storageService.getUser();
    this.notifier = notifier;
  }

  ngOnInit(): void {
    this.getAcademiesFromStore();
    this.getCompetition();
  }
  getImg = (image: string) => {
    return `${this.apiURL}/static/${image}`;
  };

  getAcademiesFromStore() {
    this.store.select(AcademySelectors.getAcademies).subscribe((academy) => {
      this.academies = academy.slice().sort((a, b) => {
        return a?.academyName?.localeCompare(b?.academyName);
      });
    });
  }
  uploadLogo(event: any) {
    const file: File = event.target.files[0];
    this.palyerService.upload(file).subscribe((res: any) => {
      if (res) {
        this.academyLogo = res.filename;
        console.log("logo update successsfully");
      }
    });
  }
  onSubmit() {
    if (!this.editAcademy) {
      if (!this.academyForm.value.academyName) {
        this.notifier.notify("error", "Academy name not provided!");
        return;
      } else {
        const user = this.storageService.getUser();
        if (this.academyForm.value.academyName) {
          const academyData = {
            "Academy Name": this.academyForm.value.academyName,
            "Academy User Name": this.academyForm.value.userName,
            "Short Code": this.selectedCompetition.shortCode,
            Email: this.academyForm.value.emailAddress,
            Password: this.academyForm.value.password,
            contact: this.academyForm.value.mobileNumber,
            Logo: this.academyLogo,
            Color: this.academyForm.value.academyColor,
            competition: this.selectedCompetition._id,
            user: {
              createdBy: user._id ? user._id : user.id
            }
          };
          const userData = {
            firstname: this.makeAcademyUserName(this.academyForm.value.coachName),
            lastname: this.makeAcademyUserName(this.academyForm.value.coachName),
            username: this.academyForm.value.userName,
            email: this.academyForm.value.emailAddress,
            password: this.academyForm.value.password,
            contact: this.academyForm.value.mobileNumber,
            shortCode: this.selectedCompetition.shortCode,
            competition: Array(this.selectedCompetition._id),
            user: {
              createdBy: user._id ? user._id : user.id,
              admin: user._id ? user._id : user.id
            },
            role: "coach"
          };
          // check if academy exists
          this.academyService.getAcademyByName({ name: this.academyForm.value.academyName }).subscribe((res: any) => {
            if (!res.message) {
              this.notifier.notify("error", "Academy Name already exists!");
              return;
            } else {
              this.userService.createUser(userData).subscribe((user: any) => {
                if (user) {
                  // add owner for new academy.
                  academyData.user = {
                    createdBy: user._id
                  };
                  this.academyService.createAcademy(academyData).subscribe(
                    (res: any) => {
                      if (res._id) {
                        this.notifier.notify("success", "Academy created successfully!");
                        this.academyForm.reset();
                        this.store.dispatch(AcademyActions.loadAcademies());
                        this.store.dispatch(UserActions.loadUsers());
                      }
                    },
                    (err: any) => {
                      this.notifier.notify("error", "Please try again!");
                    }
                  );
                }
              });
            }
          });
        }
      }
    } else {
      const academyData = {
        academyName: this.academyForm.value.academyName,
        logo: this.academyLogo,
        color: this.academyForm.value.academyColor,
        competition: this.selectedCompetition._id
      };
      this.academyService.updateAcademy(this.academyToEdit, academyData).subscribe(
        (res: any) => {
          if (res) {
            this.notifier.notify("success", "Academy updated successfully!");
            this.academyForm.reset();
            this.store.dispatch(AcademyActions.loadAcademies());
          }
        },
        (err: any) => {
          this.notifier.notify("error", "Please try again!");
        }
      );
    }
  }
  displayClubForm() {
    this.displayTeamForm = !this.displayTeamForm;
  }
  onEditPatch(academy: any) {
    this.editAcademy = true;
    this.academyToEdit = academy._id;
    this.academyForm.patchValue({
      academyName: academy.academyName,
      academyColor: academy.color
    });
    this.academyLogo = academy.logo;
    console.log(this.academyForm.value);
  }
  makeAcademyUserName(academyName: any) {
    if (academyName) {
      return academyName.replace(/\s/g, "").toLowerCase();
    }
  }

  academyDetails(id: string) {
    this.router.navigate([`${this.user.shortcode}/academies/academy/${id}`]);
  }
  redirectTo() {
    this.router.navigate([`${this.user.shortcode}/admin/academies/academy`]);
  }

  onDelete(academy: any) {
    this.academyToDel = academy;
    this.openConfirmationDialog();
  }

  public openConfirmationDialog() {
    this.confirmationDialogService
      .confirm("Teams Under Academy will be deleted also", "Do you really want to ... ?")
      .then((value) => this.deleteSelection(value))
      .catch(() => console.log("User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)"));
  }

  deleteSelection(value: any) {
    if (value) {
      this.academyService.deleteAcademy(this.academyToDel).subscribe(
        (result: any) => {
          if (result.message) {
            this.notifier.notify("success", result.message);
            this.store.dispatch(AcademyActions.loadAcademies());
            this.getAcademiesFromStore();
          }
        },
        (err: any) => {
          this.notifier.notify("error", "Please try again!");
        }
      );
    }
  }
  getCompetition() {
    this.selectedCompetition = this.storageService.getCompetition();
    if (this.selectedCompetition) {
      this.compSettings = JSON.parse(this.selectedCompetition?.competitionSettings);
    }
  }

  // Filters
  filters: string[] = [];
  addFilter(filter: string) {
    if (!this.filters.includes(filter)) {
      this.filters.push(filter);
    }
  }

  removeFilter(filter: string) {
    this.filters = this.filters.filter(f => f !== filter);
  }
}
