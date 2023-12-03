import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
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

@Component({
  selector: "app-super-admin",
  templateUrl: "./super-admin.component.html",
  styleUrls: ["./super-admin.component.scss"]
})
export class SuperAdminComponent implements OnInit {
  @ViewChild("content") content: any;
  apiURL = environment.apiURL;
  public shortCodeExists: boolean = false;
  public displayEditCompitition: boolean = false;
  public compititions: any = [];
  private notifier: NotifierService;
  compititionForm: FormGroup;
  public closeResult: string = "";
  public submitted: boolean = false;
  public compititionLogo: any;
  public compititionToBeEdit: any;

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
      compititionName: ["", Validators.required],
      organiserName: ["", Validators.required],
      organiserContact: ["", Validators.required],
      organiserEmail: ["", [Validators.required, Validators.email]],
      compititionDescription: ["", Validators.required],
      shortCode: ["", Validators.required],
      compititionLogo: [""],
      compititionBackground: ["", Validators.required],
      compititionColor: ["", Validators.required],
      compititionBorder: ["", Validators.required],
      compititionSeason: ["", Validators.required],
      compititionStart: ["", Validators.required],
      compititionEnd: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.getAllCompititions();
  }

  open(content: any) {
    debugger;
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
    debugger;
    this.store.dispatch(CompititionActions.loadCompititions());
    this.store.select(CompititionSelectors.getCompititions).subscribe((compitition: any) => {
      this.compititions = compitition;
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
    if (!this.compititionLogo) {
      this.notifier.notify("error", "Logo is not uploaded!");
    }

    if (this.compititionForm.invalid) {
      this.notifier.notify("error", "All fields are required!");
      return;
    } else {
      const user = this.storageService.getUser();
      const compititionObj = {
        compititionName: this.compititionForm.value.compititionName,
        organiserDetail: JSON.stringify({
          organiserName: this.compititionForm.value.organiserName,
          organiserContact: this.compititionForm.value.organiserContact,
          organiserEmail: this.compititionForm.value.organiserEmail,
          compititionDescription: this.compititionForm.value.compititionDescription
        }),
        shortCode: this.compititionForm.value.shortCode,
        compititionLogo: this.compititionLogo,
        compititionSettings: JSON.stringify({
          compititionBackground: this.compititionForm.value.compititionBackground,
          compititionColor: this.compititionForm.value.compititionColor,
          compititionBorder: this.compititionForm.value.compititionBorder
        }),
        compititionSeason: this.compititionForm.value.compititionSeason,
        compititionStart: this.compititionForm.value.compititionStart,
        compititionEnd: this.compititionForm.value.compititionEnd,
        createdBy: user.id
      };
      if (this.displayEditCompitition) {
        this.compititionService.updateCompitition(this.compititionToBeEdit._id, compititionObj).subscribe((res: any) => {
          if (res) {
            this.displayEditCompitition = false;
            this.compititionForm.reset();
            this.store.dispatch(CompititionActions.loadCompititions());
            console.log(res);
            this.notifier.notify("success", "Compitition updated successfully!");
          }
        });
      } else {
        this.compititionService.createCompitition(compititionObj).subscribe((res: any) => {
          if (res) {
            this.displayEditCompitition = false;
            this.store.dispatch(CompititionActions.loadCompititions());
            this.compititionForm.reset();
            this.notifier.notify("success", "Compitition created successfully!");
          }
        });
      }
    }
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
  editCompitition(compititon: any) {
    if (compititon) {
      this.compititionToBeEdit = compititon;
      this.displayEditCompitition = true;
      const organiserDetail = JSON.parse(compititon.organiserDetail);
      const compititionSettings = JSON.parse(compititon.compititionSettings);
      this.compititionLogo = compititon.compititionLogo;
      this.compititionForm.patchValue({
        compititionName: compititon.compititionName,
        organiserName: organiserDetail.organiserName,
        organiserContact: organiserDetail.organiserContact,
        organiserEmail: organiserDetail.organiserEmail,
        compititionDescription: organiserDetail.compititionDescription,
        shortCode: compititon.shortCode,
        compititionBackground: compititionSettings.compititionBackground,
        compititionColor: compititionSettings.compititionColor,
        compititionBorder: compititionSettings.compititionBorder,
        compititionSeason: compititon.compititionSeason,
        compititionStart: new Date(compititon.compititionStart).toISOString().slice(0, 10),
        compititionEnd: new Date(compititon.compititionEnd).toISOString().slice(0, 10)
      });
      this.open(this.content);
    }
  }
  deleteCompitition(compititionId: any) {
    this.compititionService.deleteCompitition(compititionId).subscribe((res: any) => {
      if (res) {
        this.notifier.notify("success", "Compitition deleted successfully!");
      }
    });
  }
}
