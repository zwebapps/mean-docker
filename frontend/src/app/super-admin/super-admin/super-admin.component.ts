import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { Store } from "@ngrx/store";
import { NotifierService } from "angular-notifier";
import { CompetitionService } from "src/app/_services/competition.service";
import { PlayerService } from "src/app/_services/player.service";
import { StorageService } from "src/app/_services/storage.service";
import { UserService } from "src/app/_services/user.service";
import { environment } from "src/environments/environment";
import * as CompetitionActions from "../../_store/actions/competitions.actions";
import * as CompetitionSelectors from "../../_store/selectors/competitions.selectors";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { Country, Countries } from "src/app/_shared/countries.data";

@Component({
  selector: "app-super-admin",
  templateUrl: "./super-admin.component.html",
  styleUrls: ["./super-admin.component.scss"]
})
export class SuperAdminComponent implements OnInit {
  @ViewChild("content") content: any;
  roles: any = [];
  apiURL = environment.apiURL;
  countries: Country[] = [];
  public eidDropdownSettings: IDropdownSettings = {};
  public shortCodeExists: boolean = false;
  public competitionExists: boolean = false;
  public displayEditCompetition: boolean = false;
  public displayCompetitions: boolean = true;
  public displayAddCompetition: boolean = false;
  public listOfCompetitions: any = [];
  private notifier: NotifierService;
  competitionForm: FormGroup;
  public closeResult: string = "";
  public submitted: boolean = false;
  public competitionLogo: any;
  public competitionToBeEdit: any;
  public patchedValues: any = {};
  public createdAdmin: any = {};

  constructor(
    private palyerService: PlayerService,
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private store: Store,
    private userService: UserService,
    notifier: NotifierService,
    private formBuilder: FormBuilder,
    private storageService: StorageService,
    private competitionService: CompetitionService,
    private cdr: ChangeDetectorRef
  ) {
    this.notifier = notifier;
    this.competitionForm = this.formBuilder.group({
      competitions: this.formBuilder.array([]),
      organiserFirstName: ["", Validators.required],
      organiserLastName: ["", Validators.required],
      organiserUserName: ["", Validators.required],
      organiserContact: ["", Validators.required],
      organiserEmail: ["", [Validators.required, Validators.email]],
      organiserPassword: ["", [Validators.required, Validators.minLength(6)]],
      shortCode: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.getAllCompetitions();
    this.addcompetitions();
    this.getCountries();
  }

  get competitions() {
    return this.competitionForm.get("competitions") as FormArray;
  }
  newCompetition(): FormGroup {
    return this.formBuilder.group({
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
  addcompetitions() {
    console.log("Adding an competitions");
    this.competitions.push(this.newCompetition());
  }

  removeCompetition(empIndex: number) {
    this.competitions.removeAt(empIndex);
  }
  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: "modal-basic-title", size: "lg" }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }
  getAllCompetitions() {
    this.store.select(CompetitionSelectors.getCompetitions).subscribe((competition: any) => {
      this.listOfCompetitions = competition;
    });
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
  get f() {
    return this.competitionForm.controls;
  }

  uploadLogo(event: any) {
    const file: File = event.target.files[0];
    const inputName = event.target.name;
    this.palyerService.upload(file).subscribe((res: any) => {
      if (res) {
        this.competitionLogo = res.filename;
        console.log("logo update successsfully");
      }
    });
  }
  onSubmit() {
    this.submitted = true;
    if (this.competitionForm.invalid) {
      this.notifier.notify("error", "All fields are required!");
      return;
    } else {
      const user = this.storageService.getUser();
      // organiserDetail: JSON.stringify({
      //   organiserFirstName: this.competitionForm.value.organiserFirstName,
      //   organiserLastName: this.competitionForm.value.organiserLastName,
      //   organiserContact: this.competitionForm.value.organiserContact,
      //   organiserEmail: this.competitionForm.value.organiserEmail,
      //   organiserPassword: this.competitionForm.value.organiserPassword,
      //   organiserUserName: this.competitionForm.value.organiserUserName
      // }),

      // user object
      const userObj = {
        firstname: this.competitionForm.value.organiserFirstName,
        lastname: this.competitionForm.value.organiserLastName,
        username: this.competitionForm.value.organiserUserName,
        contact: this.competitionForm.value.organiserContact,
        password: this.competitionForm.value.organiserPassword,
        email: this.competitionForm.value.organiserEmail,
        shortCode: this.competitionForm.value.shortCode,
        role: "admin"
      };
      const competitionObj = {
        shortCode: this.competitionForm.value.shortCode,
        competitionSeason: this.competitionForm.value.competitionSeason,
        competitionStart: this.competitionForm.value.competitionStart,
        competitionEnd: this.competitionForm.value.competitionEnd,
        competitionDescription: this.competitionForm.value.competitionDescription,
        competitionLogo: this.competitionForm.value.competitionLogo,
        competitionBackground: this.competitionForm.value.competitionBackground,
        competitionColor: this.competitionForm.value.competitionColor,
        competitionBorder: this.competitionForm.value.competitionBorder,
        competitionCountry: this.competitionForm.value.competitionCountry,
        competitionName: this.competitionForm.value.competitionName,
        competitionYear: this.competitionForm.value.competitionYear,
        user: {
          createdBy: user.id
        }
      };

      // this.competitions.value.forEach((competition: any) => {
      //   competitions.push({
      //     ...competitionObj,
      //     ...competition
      //   });
      // });

      if (this.displayEditCompetition) {
        this.updateCompetition(this.competitionToBeEdit._id, competitionObj);
        this.updateAdmin(this.competitionToBeEdit.user_id._id, { ...userObj });
      } else {
        this.displayEditCompetition = false;
        this.createAdmin(userObj);
      }
    }
  }
  createCompetittion(competitionObj: any) {
    let competitions: any = [];
    this.competitions.value.forEach((competition: any) => {
      competitions.push({
        ...competitionObj,
        ...competition
      });
    });
    this.competitionService.createCompetition(competitions).subscribe((res: any) => {
      if (res) {
        if (this.createdAdmin.competition) {
          this.createdAdmin.competition.push(res.map((comp: any) => comp._id));
        }
        this.updateAdmin(this.createdAdmin._id, this.createdAdmin);
        this.displayEditCompetition = false;
        this.store.dispatch(CompetitionActions.loadCompetitions());
        this.competitionForm.reset();
        this.notifier.notify("success", "Competition created successfully!");
      }
    });
  }
  updateCompetition(id: any, competitionObj: any) {
    this.competitionService.updateCompetition(id, competitionObj).subscribe((res: any) => {
      if (res) {
        this.displayEditCompetition = false;
        this.competitionForm.reset();
        this.store.dispatch(CompetitionActions.loadCompetitions());
        this.notifier.notify("success", "Competition updated successfully!");
      }
    });
  }
  createAdmin(user: any) {
    const loggedInUser = this.storageService.getUser();
    this.userService.createUser(user).subscribe((res: any) => {
      if (!res.message) {
        this.createdAdmin = res;
        this.createCompetittion({
          ...this.competitionForm.value,
          organiser: res._id,
          user: {
            createdBy: loggedInUser.id
          }
        });
      } else {
        this.notifier.notify("error", res.message);
      }
    });
  }
  updateAdmin(id: any, user: any) {
    this.userService.updateUser(id, user).subscribe((res: any) => {
      if (res) {
        console.log(res);
      }
    });
  }
  getDescription(data: any) {
    return JSON.parse(data)?.competitionDescription || "No Description provided";
  }
  getOrganiser(data: any) {
    return JSON.parse(data)?.organiserName || "No Organiser provided";
  }
  getSantizedpopUpUrl = (image: any) => {
    const logoUrl = `${this.apiURL}/static/${image}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(logoUrl);
  };
  verifyShortCode(event: any) {
    const shortCode = event.target.value;
    if (shortCode && shortCode.length > 2) {
      this.competitionService.getCompetitionByShortCode(shortCode).subscribe((res: any) => {
        if (!res.message) {
          this.shortCodeExists = true;
        } else {
          this.shortCodeExists = false;
        }
      });
    }
  }
  verifyCompetition(event: any) {
    const comp = event.target.value;
    if (comp && comp.length > 2) {
      this.competitionService.getCompetitionByShortCode(comp).subscribe((res: any) => {
        if (!res.message) {
          this.competitionExists = true;
        } else {
          this.competitionExists = false;
        }
      });
    }
  }
  editCompetition(competiton: any) {
    if (competiton) {
      this.competitionToBeEdit = competiton;
      const { organiser } = competiton;
      this.displayEditCompetition = true;
      // const organiserDetail = competiton.organiserDetail ? JSON.parse(competiton.organiserDetail) : {};
      // const competitionSettings = competiton.competitionSettings ? JSON.parse(competiton.competitionSettings) : {};
      this.competitionLogo = competiton.competitionLogo;
      this.addCompFormToggle();
      this.patchedValues = {
        organiserFirstName: organiser.firstname,
        organiserLastName: organiser.lastname,
        organiserContact: organiser.contact,
        organiserEmail: organiser.email,
        shortCode: competiton?.shortCode,
        organiserUserName: organiser.username,
        organiserPassword: organiser.password,
        competitions: [
          {
            competitionBackground: "#ffffff",
            competitionBorder: "#fefefe",
            competitionColor: "#eeeeee",
            competitionCountry: competiton?.competitionCountry,
            competitionDescription: "Competition description",
            competitionLogo: competiton?.competitionLogo,
            competitionName: competiton?.competitionName,
            competitionSeason: competiton?.competitionSeason,
            competitionStart: competiton?.competitionStart ? new Date(competiton?.competitionStart).toISOString().slice(0, 10) : null,
            competitionEnd: competiton?.competitionEnd ? new Date(competiton?.competitionEnd).toISOString().slice(0, 10) : null,
            competitionYear: 2023
          }
        ]
      };

      this.competitionForm.controls.organiserFirstName.disable();
      this.competitionForm.controls.organiserFirstName.disable();
      this.competitionForm.controls.organiserLastName.disable();
      this.competitionForm.controls.organiserContact.disable();
      this.competitionForm.controls.organiserEmail.disable();
      this.competitionForm.controls.shortCode.disable();
      this.competitionForm.controls.organiserUserName.disable();
      this.competitionForm.controls.organiserPassword.disable();
      // this.competitionForm.patchValue(this.patchedValues);
      console.log(this.competitionForm.value);
    }
  }
  addCompFormToggle() {
    this.displayAddCompetition = !this.displayAddCompetition;
    this.displayCompetitions = !this.displayCompetitions;
    // this.competitionForm.reset();
  }
  deleteCompetition(competitionId: any) {
    this.competitionService.deleteCompetition(competitionId).subscribe((res: any) => {
      if (res) {
        this.notifier.notify("success", res.message);
        this.getAllCompetitions();
      }
    });
  }
  filterCompetitions(text: any) {
    this.getAllCompetitions();
    this.listOfCompetitions = this.listOfCompetitions.filter((competition: any) => {
      return competition.competitionName.toLowerCase().includes(text.toLowerCase());
    });
  }
  getCountries() {
    this.countries = Countries;
  }

  getRoles() {
    this.userService.getAllRoles().subscribe((result: any) => {
      if (result) {
        this.roles = result;
      }
    });
  }
}
