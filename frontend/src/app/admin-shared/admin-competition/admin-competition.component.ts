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
import { CompititionService } from "../../_services/compitition.service";
import * as CompititionActions from "../../_store/actions/compititions.actions";
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
  compititionForm: FormGroup;
  submitted = false;
  displayEditCompitition = false;
  createdAdmin: any;
  compititionToBeEdit: any;
  public patchedValues: any = {};
  public closeResult: string = "";
  public compititionLogo: any;
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
    private compititionService: CompititionService,
    private modalService: NgbModal,
    private playerService: PlayerService
  ) {
    this.notifier = notifier;
    this.topcards = topcards;
    this.compititionForm = this.formBuilder.group({
      shortCode: ["", Validators.required],
      compititionName: ["", Validators.required],
      compititionYear: ["", Validators.required],
      compititionCountry: ["", Validators.required],
      compititionDescription: [""],
      compititionLogo: [""],
      compititionBackground: [""],
      compititionColor: [""],
      compititionBorder: [""],
      compititionSeason: [""],
      compititionStart: [""],
      compititionEnd: ["2024"]
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
  }

  setCompetition(event: any) {
    if (event) {
      this.selectedCompetition = event;
      this.storageService.setCompetition(this.selectedCompetition);
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.compititionForm.invalid) {
      this.notifier.notify("error", "All fields are required!");
      return;
    } else {
      const user = this.storageService.getUser();

      const compititionObj = {
        organiser: user._id,
        shortCode: this.compititionForm.value.shortCode || this.patchedValues.shortCode,
        compititionSeason: this.compititionForm.value.compititionSeason,
        compititionStart: this.compititionForm.value.compititionStart,
        compititionEnd: this.compititionForm.value.compititionEnd,
        compititionDescription: this.compititionForm.value.compititionDescription,
        compititionLogo: this.compititionLogo,
        compititionCountry: this.compititionForm.value.compititionCountry,
        compititionName: this.compititionForm.value.compititionName || this.patchedValues.compititionName,
        compititionYear: this.compititionForm.value.compititionYear,
        compititionSettings: JSON.stringify({
          compititionBackground: this.compititionForm.value.compititionBackground,
          compititionColor: this.compititionForm.value.compititionColor,
          compititionBorder: this.compititionForm.value.compititionBorder
        })
      };
      // console.log(compititionObj);
      this.updateCompitition(this.compititionToBeEdit._id, compititionObj);
      this.modalService.dismissAll();
    }
  }
  get f() {
    return this.compititionForm.controls;
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
  editCompetition(compititon: any) {
    if (compititon) {
      this.compititionToBeEdit = compititon;
      let settings = compititon?.compititionSettings;
      if (settings) {
        settings = JSON.parse(settings);
      }
      (this.compititionLogo = compititon?.compititionLogo),
        (this.patchedValues = {
          shortCode: compititon?.shortCode,
          compititionBackground: settings?.compititionBackground || "#ffffff",
          compititionBorder: settings?.compititionBorder || "#fefefe",
          compititionColor: compititon?.compititionColor || "#eeeeee",
          compititionCountry: compititon?.compititionCountry,
          compititionDescription: compititon?.compititionDescription || "Enter description",
          compititionName: compititon?.compititionName,
          compititionSeason: compititon?.compititionSeason,
          compititionStart: compititon?.compititionStart ? new Date(compititon?.compititionStart).toISOString().slice(0, 10) : null,
          compititionEnd: compititon?.compititionEnd ? new Date(compititon?.compititionEnd).toISOString().slice(0, 10) : null,
          compititionYear: parseInt(new Date().getFullYear().toString())
        });
      // compititionYear: compititon?.compititionYear ? compititon?.compititionYear : parseInt(new Date().getFullYear().toString())
      this.compititionForm.controls.shortCode.disable();
      this.compititionForm.controls.compititionName.disable();
    }
  }
  uploadLogo(event: any) {
    const file: File = event.target.files[0];
    const inputName = event.target.name;
    this.playerService.upload(file).subscribe((res: any) => {
      if (res) {
        this.compititionLogo = res.filename;
        console.log("logo update successsfully");
      }
    });
  }
  updateCompitition(id: any, competitionObj: any) {
    this.compititionService.updateCompitition(id, competitionObj).subscribe((res: any) => {
      if (res) {
        this.notifier.notify("success", "Competition updated successfully!");
        this.compititionForm.reset();
        this.store.dispatch(CompititionActions.loadCompititions());
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
