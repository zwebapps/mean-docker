import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { NotifierService } from "angular-notifier";
import { DashboardService } from "../../_services/dashbaord.service";
import * as UserSelectors from "../../_store/selectors/users.selectors";
import * as TeamSelectors from "../../_store/selectors/teams.selectors";
import { topcard, topcards } from "../../dashboard/dashboard-components/top-cards/top-cards-data";
import { environment } from "../../../environments/environment";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { StorageService } from "../../_services/storage.service";
import { CompetitionService } from "../../_services/competition.service";
import * as CompetitionActions from "../../_store/actions/competitions.actions";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as countriesData from "../../../assets/countries/countries.json";
import { PlayerService } from "../../_services/player.service";

@Component({
  selector: "app-admin-competition",
  templateUrl: "./admin-competition.component.html",
  styleUrls: ["./admin-competition.component.scss"]
})
export class AdminCompetitionComponent {
  countries: any = [];
  public blogcards: any = [];
  public dashboardContents: any = {};
  apiURL = environment.apiURL;
  private notifier: NotifierService;
  competitionForm: FormGroup;
  submitted = false;
  displayEditCompetition = false;
  createdAdmin: any;
  competitionToBeEdit: any;
  public patchedValues: any = {};
  public closeResult: string = "";
  public competitionLogo: any;
  public selectedCompetition: any = {};
  topcards: topcard[];
  users: any = [];
  teams: any = [];
  constructor(
    private store: Store,
    private dashboardService: DashboardService,
    notifier: NotifierService,
    private formBuilder: FormBuilder,
    private storageService: StorageService,
    private competitionService: CompetitionService,
    private modalService: NgbModal,
    private playerService: PlayerService
  ) {
    this.notifier = notifier;
    this.topcards = topcards;
    this.competitionForm = this.formBuilder.group({
      shortCode: ["", Validators.required],
      competitionName: ["", Validators.required],
      competitionYear: ["", Validators.required],
      competitionCountry: ["", Validators.required],
      competitionDescription: [""],
      competitionLogo: [""],
      competitionBackground: [""],
      competitionColor: [""],
      competitionBorder: [""],
      competitionSeason: [""],
      competitionStart: [""],
      competitionEnd: ["2024"]
    });
  }

  ngOnInit(): void {
    // select to get user from store
    this.store.select(UserSelectors.getUsers).subscribe((users) => {
      this.users = users;
    });

    this.store.select(TeamSelectors.getTeams).subscribe((teams) => {
      this.teams = teams;
    });

    this.getDashboardContents();
    this.getCountries();
    this.getCompetition();
  }

  setCompetition(event: any) {
    if (event) {
      this.selectedCompetition = event;
      this.storageService.setCompetition(this.selectedCompetition);
    }
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  }

  getCompetition() {
    this.selectedCompetition = this.storageService.getCompetition();
  }

  onSubmit() {
    this.submitted = true;
    if (this.competitionForm.invalid) {
      this.notifier.notify("error", "All fields are required!");
      return;
    } else {
      const user = this.storageService.getUser();

      const competitionObj = {
        organiser: user._id,
        shortCode: this.competitionForm.value.shortCode || this.patchedValues.shortCode,
        competitionSeason: this.competitionForm.value.competitionSeason,
        competitionStart: this.competitionForm.value.competitionStart,
        competitionEnd: this.competitionForm.value.competitionEnd,
        competitionDescription: this.competitionForm.value.competitionDescription,
        competitionLogo: this.competitionLogo,
        competitionCountry: this.competitionForm.value.competitionCountry,
        competitionName: this.competitionForm.value.competitionName || this.patchedValues.competitionName,
        competitionYear: this.competitionForm.value.competitionYear,
        competitionSettings: JSON.stringify({
          competitionBackground: this.competitionForm.value.competitionBackground,
          competitionColor: this.competitionForm.value.competitionColor,
          competitionBorder: this.competitionForm.value.competitionBorder
        })
      };
      // console.log(competitionObj);
      this.updateCompetition(this.competitionToBeEdit._id, competitionObj);
      this.modalService.dismissAll();
    }
  }
  get f() {
    return this.competitionForm.controls;
  }
  open(content: any, competition: any) {
    this.editCompetition(competition);
    this.modalService.open(content, { ariaLabelledBy: "modal-basic-title", size: "lg" }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }
  editCompetition(competiton: any) {
    if (competiton) {
      this.competitionToBeEdit = competiton;
      let settings = competiton?.competitionSettings;
      if (settings) {
        settings = JSON.parse(settings);
      }
      (this.competitionLogo = competiton?.competitionLogo),
        (this.patchedValues = {
          shortCode: competiton?.shortCode,
          competitionBackground: settings?.competitionBackground || "#ffffff",
          competitionBorder: settings?.competitionBorder || "#fefefe",
          competitionColor: competiton?.competitionColor || "#eeeeee",
          competitionCountry: competiton?.competitionCountry,
          competitionDescription: competiton?.competitionDescription || "Enter description",
          competitionName: competiton?.competitionName,
          competitionSeason: competiton?.competitionSeason,
          competitionStart: competiton?.competitionStart ? new Date(competiton?.competitionStart).toISOString().slice(0, 10) : null,
          competitionEnd: competiton?.competitionEnd ? new Date(competiton?.competitionEnd).toISOString().slice(0, 10) : null,
          competitionYear: parseInt(new Date().getFullYear().toString())
        });
      // competitionYear: competiton?.competitionYear ? competiton?.competitionYear : parseInt(new Date().getFullYear().toString())
      this.competitionForm.controls.shortCode.disable();
      this.competitionForm.controls.competitionName.disable();
    }
  }
  uploadLogo(event: any) {
    const file: File = event.target.files[0];
    const inputName = event.target.name;
    this.playerService.upload(file).subscribe((res: any) => {
      if (res) {
        this.competitionLogo = res.filename;
        console.log("logo update successsfully");
      }
    });
  }
  updateCompetition(id: any, competitionObj: any) {
    this.competitionService.updateCompetition(id, competitionObj).subscribe((res: any) => {
      if (res) {
        this.notifier.notify("success", "Competition updated successfully!");
        this.competitionForm.reset();
        this.store.dispatch(CompetitionActions.loadCompetitions());
      }
    });
  }
  getDashboardContents() {
    this.dashboardService.getDashboardContents().subscribe((res: any) => {
      if (res) {
        this.dashboardContents = res.data;
        this.mapDashboardContents();
      }
    });
  }
  mapDashboardContents() {
    if (Object.keys(this.dashboardContents).length > 0) {
      Object.keys(this.dashboardContents).forEach((key) => {
        this.blogcards.push({
          title: key,
          count: this.dashboardContents[key].length.toString(),
          image: `${key}.svg`,
          bgcolor: "success",
          icon: "bi bi-wallet"
        });
      });
    }
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
  getCountries() {
    this.countries = (countriesData as any).default;
  }
}
