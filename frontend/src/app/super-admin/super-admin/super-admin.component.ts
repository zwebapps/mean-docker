import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
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
import * as UserActions from "../../_store/actions/users.actions";
import * as CompetitionSelectors from "../../_store/selectors/competitions.selectors";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { Country, Countries } from "src/app/_shared/countries.data";
// importing selectors
import * as UserSelectors from "./../../_store/selectors/users.selectors";

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
  public competitionForm: FormGroup;
  public closeResult: string = "";
  public submitted: boolean = false;
  public competitionLogo: any;
  public competitionToBeEdit: any;
  public patchedValues: any = {};
  public createdAdmin: any = {};
  public users: any;
  public loggedInUser: any = {};
  public filterString: string = "";

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
      shortCode: ["", Validators.required],
      competitionCountry: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.getAllCompetitions();
    this.addcompetitions();
    this.getCountries();
    this.getLoggedInUser();
    this.loadUsers();
  }
  loadUsers() {
    this.store.dispatch(UserActions.loadUsers());
  }
  getLoggedInUser() {
    this.loggedInUser = this.storageService.getUser();
    this.store.select(UserSelectors.getUsers).subscribe((users) => {
      if (users) {
        if (this.filterString) {
          this.users = users.filter(
            (user: any) =>
              user.createdBy &&
              user.createdBy === this.loggedInUser.id &&
              user.competition &&
              user.competition.some((c: any) => c.competitionName.toLowerCase().includes(this.filterString.toLowerCase()))
          );
        } else {
          this.users = users.filter((user: any) => user.createdBy && user.createdBy === this.loggedInUser.id);
        }
      }
    });
  }
  get competitions() {
    return this.competitionForm.get("competitions") as FormArray;
  }
  newCompetition(): FormGroup {
    return this.formBuilder.group({
      competitionName: ["", Validators.required],
      competitionYear: ["", Validators.required],
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
      // user object
      const userObj: any = {};
      if (this.competitionForm.value && this.competitionForm.value.organiserFirstName) {
        userObj.firstname = this.competitionForm.value.organiserFirstName;
      }
      if (this.competitionForm.value && this.competitionForm.value.organiserLastName) {
        userObj.lastname = this.competitionForm.value.organiserLastName;
      }

      if (this.competitionForm.value && this.competitionForm.value.organiserUserName) {
        userObj.username = this.competitionForm.value.organiserUserName;
      }

      if (this.competitionForm.value && this.competitionForm.value.organiserContact) {
        userObj.contact = this.competitionForm.value.organiserContact;
      }

      if (this.competitionForm.value && this.competitionForm.value.organiserPassword) {
        userObj.password = this.competitionForm.value.organiserPassword;
      }

      if (this.competitionForm.value && this.competitionForm.value.organiserEmail) {
        userObj.email = this.competitionForm.value.organiserEmail;
      }

      if (this.competitionForm.value && this.competitionForm.value.shortCode) {
        userObj.shortCode = this.competitionForm.value.shortCode;
      }

      if (this.competitionForm.value && this.competitionForm.value.competitionCountry) {
        userObj.competitionCountry = this.competitionForm.value.competitionCountry;
      }

      userObj.user = {
        createdBy: user.id
      };

      userObj.role = "admin";
      if (this.displayEditCompetition) {
        const { competition } = this.competitionToBeEdit;
        for (let i = 0; i < competition.length; i++) {
          this.updateSingleCompetition(i);
        }

        this.updateAdmin(this.competitionToBeEdit._id, { ...userObj });
      } else {
        this.displayEditCompetition = false;
        this.createAdmin(userObj);
      }
    }
    this.loadUsers();
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
          this.createdAdmin.competition = res.map((comp: any) => comp._id);
        }
        this.updateAdmin(this.createdAdmin._id, this.createdAdmin);
        this.notifier.notify("success", "Competition created successfully!");
        this.addCompFormToggle();
        this.store.dispatch(CompetitionActions.loadCompetitions());
        this.competitionForm.reset();
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
  updateSingleCompetition(id: any) {
    const { competition } = this.competitionToBeEdit;
    const compId = competition[id]._id;
    console.log(this.competitionForm.value.competitions[id], compId);
    this.competitionService.updateCompetition(compId, this.competitionForm.value.competitions[id]).subscribe((res: any) => {
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
        const { competitions } = this.competitionForm.value;
        if (competitions) {
          this.createCompetittion({
            shortCode: res.shortcode,
            organiser: res._id,
            user: {
              createdBy: loggedInUser.id
            }
          });
        }
      } else {
        this.notifier.notify("error", res.message);
      }
    });
  }
  updateAdmin(id: any, user: any) {
    this.userService.updateUser(id, user).subscribe((res: any) => {
      if (res) {
        this.notifier.notify("success", "Admin updated successfully!");
      }
      this.addCompFormToggle();
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
          if (res.length > 0) {
            this.notifier.notify("error", "Short code already exists");
          }
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
          if (res.length > 0) {
            this.notifier.notify("error", "Competition already exists");
          }
          this.competitionExists = true;
        } else {
          this.competitionExists = false;
        }
      });
    }
  }
  editCompetition(compData: any) {
    if (compData) {
      const { competition } = compData;
      this.removeCompetition(0);
      if (Array.isArray(competition)) {
        for (let i = 0; i < competition.length; i++) {
          this.addcompetitions();
        }
      }
      this.competitionToBeEdit = compData;
      this.displayEditCompetition = true;
      this.competitionLogo = compData.competitionLogo;
      this.addCompFormToggle();
      this.patchedValues = {
        organiserFirstName: compData?.firstname,
        organiserLastName: compData?.lastname,
        organiserContact: compData?.contact,
        organiserEmail: compData?.email,
        shortCode: compData?.shortcode,
        organiserUserName: compData.username,
        organiserPassword: compData.password,
        competitionCountry: compData?.competitionCountry ? compData?.competitionCountry : "ae",
        competitions: competition
      };

      this.competitionForm.controls.organiserFirstName.disable();
      this.competitionForm.controls.organiserFirstName.disable();
      this.competitionForm.controls.organiserLastName.disable();
      this.competitionForm.controls.organiserContact.disable();
      this.competitionForm.controls.organiserEmail.disable();
      this.competitionForm.controls.shortCode.disable();
      this.competitionForm.controls.organiserUserName.disable();
      // this.competitionForm.controls.organiserPassword.disable();
      this.competitionForm.patchValue(this.patchedValues);
      console.log(this.competitionForm.value);
    }
  }
  addCompFormToggle() {
    this.displayAddCompetition = !this.displayAddCompetition;
    this.displayCompetitions = !this.displayCompetitions;
    // this.competitionForm.reset();
  }
  deleteCompetition(comp: any) {
    const { _id, competition } = comp;
    this.deleteUsers(_id);
    if (Array.isArray(competition)) {
      competition.forEach((comp: any) => {
        this.removeCompetitions(comp._id);
      });
    }
    this.loadUsers();
  }
  deleteUsers(id: any) {
    this.userService.deleteUser(id).subscribe((res: any) => {
      if (res) {
        this.notifier.notify("success", res.message);
      }
    });
  }
  removeCompetitions(comp: any) {
    this.competitionService.deleteCompetition(comp).subscribe((res: any) => {
      if (res) {
        this.notifier.notify("success", res.message);
        this.getAllCompetitions();
      }
    });
  }
  filterCompetitions(text: any) {
    if (text.length > 0) {
      this.filterString = text;
    } else {
      this.filterString = "";
    }
    this.getLoggedInUser();
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
