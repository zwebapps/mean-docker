import { Component, OnInit } from "@angular/core";
import { NotifierService } from "angular-notifier";
import { AcademyService } from "src/app/_services/academy.service";
import { StorageService } from "src/app/_services/storage.service";
import { Store } from "@ngrx/store";
import { ActivatedRoute, Router } from "@angular/router";
import { FormControl, FormGroup } from "@angular/forms";
import { TeamService } from "src/app/_services/team.service";
import { ConfirmationDialogService } from "src/app/_services/confirmation-dialog.service";
import * as TeamActions from "../../_store/actions/teams.actions";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-academy-detail",
  templateUrl: "./academy-detail.component.html",
  styleUrls: ["./academy-detail.component.scss"]
})
export class AcademyDetailComponent implements OnInit {
  public selectedCompetition: any = {};
  public compSettings: any = {};
  user: any = {};
  private notifier: NotifierService;
  academy: any = {};
  teams: any;
  teamToDel: string = null;
  teamForm = new FormGroup({
    teamName: new FormControl("")
  });
  apiURL = environment.apiURL;
  displayTeamForm: boolean = false;
  constructor(
    private storageService: StorageService,
    notifier: NotifierService,
    private academyService: AcademyService,
    private teamService: TeamService,
    private store: Store,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    this.user = this.storageService.getUser();
    this.notifier = notifier;
  }

  ngOnInit(): void {
    let id = this.activatedRoute.snapshot.params["id"];
    this.academyService.getAcademyById(id).subscribe(
      (res: any) => {
        if (res) {
          this.academy = res;
          this.getTeamsByAcademy(this.academy._id);
        } else {
          this.notifier.notify("error", "Academy not found!");
        }
      },
      (err) => {
        this.notifier.notify("error", "Please try again!");
      }
    );
    this.getCompetition();
  }
  onSubmit() {
    if (!this.teamForm.value.teamName) {
      this.notifier.notify("error", "Academy name not provided!");
      return;
    } else {
      const user = this.storageService.getUser();
      if (this.teamForm.value.teamName) {
        const teamData = {
          "Team Name": this.teamForm.value.teamName,
          "Academy Id": this.academy._id,
          leagues: [],
          shortCode: this.selectedCompetition.shortCode,
          competition: this.selectedCompetition._id,
          user: {
            createdBy: user.id
          }
        };
        this.teamService.createTeam(teamData).subscribe((res: any) => {
          this.getTeamsByAcademy(this.academy._id);
          if (res._id) {
            this.notifier.notify("success", "Team created successfully!");
            this.store.dispatch(TeamActions.loadTeams());
            this.teamForm.reset();
            this.displayTeamForm = false;
          } else {
            this.notifier.notify("error", res.message);
          }
        });
      }
    }
  }
  getImg = (image: string) => {
    return `${this.apiURL}/static/${image}`;
  };
  getTeamsByAcademy = (academyId: string): any => {
    this.teamService.getTeamsByAcademy(academyId).subscribe(
      (res: any) => {
        if (Array.isArray(res)) {
          this.teams = res;
        } else {
          this.notifier.notify("error", res.message);
          this.teams = [];
        }
        // else {
        //   this.notifier.notify("error", res.message);
        // }
      },
      (err) => {
        this.notifier.notify("error", "Please try again!");
      }
    );
  };
  onTeamClick = (team: any) => {
    this.router.navigate([`${this.user.shortcode}/admin/academy/team/${team._id}`]);
  };
  onDelete(teamId: any) {
    this.teamToDel = teamId;
    this.openConfirmationDialog();
  }

  openConfirmationDialog() {
    this.confirmationDialogService
      .confirm("Please confirm..", "Do you really want to ... ?")
      .then((value) => this.deleteSelection(value))
      .catch(() => console.log("User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)"));
  }
  deleteSelection(value: any) {
    if (value) {
      this.teamService.deleteTeam(this.teamToDel).subscribe((result: any) => {
        if (result.message) {
          this.notifier.notify("success", result.message);
          this.store.dispatch(TeamActions.loadTeams());
          this.getTeamsByAcademy(this.academy._id);
        }
      });
    }
  }
  redirectTo() {
    this.router.navigate([`${this.user.shortcode}/admin/academies`]);
  }
  getCompetition() {
    this.selectedCompetition = this.storageService.getCompetition();
    if (this.selectedCompetition) {
      this.compSettings = JSON.parse(this.selectedCompetition?.competitionSettings);
    }
  }
  toggleTeamForm() {
    this.displayTeamForm = !this.displayTeamForm;
  }
}
