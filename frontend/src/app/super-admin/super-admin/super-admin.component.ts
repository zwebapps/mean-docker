import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { Store } from "@ngrx/store";
import { NotifierService } from "angular-notifier";
import { CompititionService } from "src/app/_services/compitition.service";
import { PlayerService } from "src/app/_services/player.service";
import { StorageService } from "src/app/_services/storage.service";
import { UserService } from "src/app/_services/user.service";
import { environment } from "src/environments/environment";
import * as CompititionActions from "../../_store/actions/compititions.actions";
import * as CompititionSelectors from "../../_store/selectors/compititions.selectors";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import * as countriesData from "../../../assets/countries/countries.json";

@Component({
  selector: "app-super-admin",
  templateUrl: "./super-admin.component.html",
  styleUrls: ["./super-admin.component.scss"]
})
export class SuperAdminComponent implements OnInit {
  @ViewChild("content") content: any;
  roles: any = [];
  apiURL = environment.apiURL;
  countries: any = [];
  public eidDropdownSettings: IDropdownSettings = {};
  public shortCodeExists: boolean = false;
  public competitionExists: boolean = false;
  public displayEditCompitition: boolean = false;
  public displayCompetitions: boolean = true;
  public displayAddCompitition: boolean = false;
  public listOfCompetitions: any = [];
  private notifier: NotifierService;
  compititionForm: FormGroup;
  public closeResult: string = "";
  public submitted: boolean = false;
  public compititionLogo: any;
  public compititionToBeEdit: any;
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
    private compititionService: CompititionService,
    private cdr: ChangeDetectorRef
  ) {
    this.notifier = notifier;
    this.compititionForm = this.formBuilder.group({
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
    this.getAllCompititions();
    this.addcompetitions();
    this.getCountries();
  }

  get competitions() {
    return this.compititionForm.get("competitions") as FormArray;
  }
  newCompetition(): FormGroup {
    return this.formBuilder.group({
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
  getAllCompititions() {
    this.store.select(CompititionSelectors.getCompititions).subscribe((compitition: any) => {
      this.listOfCompetitions = compitition;
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
    return this.compititionForm.controls;
  }

  uploadLogo(event: any) {
    const file: File = event.target.files[0];
    const inputName = event.target.name;
    this.palyerService.upload(file).subscribe((res: any) => {
      if (res) {
        this.compititionLogo = res.filename;
        console.log("logo update successsfully");
      }
    });
  }
  onSubmit() {
    this.submitted = true;
    if (this.compititionForm.invalid) {
      this.notifier.notify("error", "All fields are required!");
      return;
    } else {
      const user = this.storageService.getUser();
      // organiserDetail: JSON.stringify({
      //   organiserFirstName: this.compititionForm.value.organiserFirstName,
      //   organiserLastName: this.compititionForm.value.organiserLastName,
      //   organiserContact: this.compititionForm.value.organiserContact,
      //   organiserEmail: this.compititionForm.value.organiserEmail,
      //   organiserPassword: this.compititionForm.value.organiserPassword,
      //   organiserUserName: this.compititionForm.value.organiserUserName
      // }),

      // user object
      const userObj = {
        firstname: this.compititionForm.value.organiserFirstName,
        lastname: this.compititionForm.value.organiserLastName,
        username: this.compititionForm.value.organiserUserName,
        contact: this.compititionForm.value.organiserContact,
        password: this.compititionForm.value.organiserPassword,
        email: this.compititionForm.value.organiserEmail,
        shortCode: this.compititionForm.value.shortCode,
        role: "admin"
      };
      const compititionObj = {
        shortCode: this.compititionForm.value.shortCode,
        compititionSeason: this.compititionForm.value.compititionSeason,
        compititionStart: this.compititionForm.value.compititionStart,
        compititionEnd: this.compititionForm.value.compititionEnd,
        compititionDescription: this.compititionForm.value.compititionDescription,
        compititionLogo: this.compititionForm.value.compititionLogo,
        compititionBackground: this.compititionForm.value.compititionBackground,
        compititionColor: this.compititionForm.value.compititionColor,
        compititionBorder: this.compititionForm.value.compititionBorder,
        compititionCountry: this.compititionForm.value.compititionCountry,
        compititionName: this.compititionForm.value.compititionName,
        compititionYear: this.compititionForm.value.compititionYear,
        user: {
          createdBy: user.id
        }
      };

      // this.competitions.value.forEach((compitition: any) => {
      //   competitions.push({
      //     ...compititionObj,
      //     ...compitition
      //   });
      // });

      if (this.displayEditCompitition) {
        this.updateCompitition(this.compititionToBeEdit._id, compititionObj);
        this.updateAdmin(this.compititionToBeEdit.user_id._id, { ...userObj });
      } else {
        this.displayEditCompitition = false;
        this.createAdmin(userObj);
      }
    }
  }
  createCompetittion(competitionObj: any) {
    let competitions: any = [];
    this.competitions.value.forEach((compitition: any) => {
      competitions.push({
        ...competitionObj,
        ...compitition
      });
    });
    this.compititionService.createCompitition(competitions).subscribe((res: any) => {
      if (res) {
        if (this.createdAdmin.compitition) {
          this.createdAdmin.compitition.push(res.map((comp: any) => comp._id));
        }
        this.updateAdmin(this.createdAdmin._id, this.createdAdmin);
        this.displayEditCompitition = false;
        this.store.dispatch(CompititionActions.loadCompititions());
        this.compititionForm.reset();
        this.notifier.notify("success", "Compitition created successfully!");
      }
    });
  }
  updateCompitition(id: any, competitionObj: any) {
    this.compititionService.updateCompitition(id, competitionObj).subscribe((res: any) => {
      if (res) {
        this.displayEditCompitition = false;
        this.compititionForm.reset();
        this.store.dispatch(CompititionActions.loadCompititions());
        this.notifier.notify("success", "Compitition updated successfully!");
      }
    });
  }
  createAdmin(user: any) {
    const loggedInUser = this.storageService.getUser();
    this.userService.createUser(user).subscribe((res: any) => {
      if (!res.message) {
        this.createdAdmin = res;
        this.createCompetittion({
          ...this.compititionForm.value,
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
    return JSON.parse(data)?.compititionDescription || "No Description provided";
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
      this.compititionService.getCompititionByShortCode(shortCode).subscribe((res: any) => {
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
      this.compititionService.getCompititionByShortCode(comp).subscribe((res: any) => {
        if (!res.message) {
          this.competitionExists = true;
        } else {
          this.competitionExists = false;
        }
      });
    }
  }
  editCompitition(compititon: any) {
    if (compititon) {
      this.compititionToBeEdit = compititon;
      const { organiser } = compititon;
      this.displayEditCompitition = true;
      // const organiserDetail = compititon.organiserDetail ? JSON.parse(compititon.organiserDetail) : {};
      // const compititionSettings = compititon.compititionSettings ? JSON.parse(compititon.compititionSettings) : {};
      this.compititionLogo = compititon.compititionLogo;
      this.addCompFormToggle();
      this.patchedValues = {
        organiserFirstName: organiser.firstname,
        organiserLastName: organiser.lastname,
        organiserContact: organiser.contact,
        organiserEmail: organiser.email,
        shortCode: compititon?.shortCode,
        organiserUserName: organiser.username,
        organiserPassword: organiser.password,
        competitions: [
          {
            compititionBackground: "#ffffff",
            compititionBorder: "#fefefe",
            compititionColor: "#eeeeee",
            compititionCountry: compititon?.compititionCountry,
            compititionDescription: "Competition description",
            compititionLogo: compititon?.compititionLogo,
            compititionName: compititon?.compititionName,
            compititionSeason: compititon?.compititionSeason,
            compititionStart: compititon?.compititionStart ? new Date(compititon?.compititionStart).toISOString().slice(0, 10) : null,
            compititionEnd: compititon?.compititionEnd ? new Date(compititon?.compititionEnd).toISOString().slice(0, 10) : null,
            compititionYear: 2023
          }
        ]
      };

      this.compititionForm.controls.organiserFirstName.disable();
      this.compititionForm.controls.organiserFirstName.disable();
      this.compititionForm.controls.organiserLastName.disable();
      this.compititionForm.controls.organiserContact.disable();
      this.compititionForm.controls.organiserEmail.disable();
      this.compititionForm.controls.shortCode.disable();
      this.compititionForm.controls.organiserUserName.disable();
      this.compititionForm.controls.organiserPassword.disable();
      // this.compititionForm.patchValue(this.patchedValues);
      console.log(this.compititionForm.value);
    }
  }
  addCompFormToggle() {
    this.displayAddCompitition = !this.displayAddCompitition;
    this.displayCompetitions = !this.displayCompetitions;
    // this.compititionForm.reset();
  }
  deleteCompitition(compititionId: any) {
    this.compititionService.deleteCompitition(compititionId).subscribe((res: any) => {
      if (res) {
        this.notifier.notify("success", res.message);
        this.getAllCompititions();
      }
    });
  }
  filterCompetitions(text: any) {
    this.getAllCompititions();
    this.listOfCompetitions = this.listOfCompetitions.filter((compitition: any) => {
      return compitition.compititionName.toLowerCase().includes(text.toLowerCase());
    });
  }
  getCountries() {
    this.countries = (countriesData as any).default;
  }

  getRoles() {
    this.userService.getAllRoles().subscribe((result: any) => {
      if (result) {
        this.roles = result;
      }
    });
  }
}
