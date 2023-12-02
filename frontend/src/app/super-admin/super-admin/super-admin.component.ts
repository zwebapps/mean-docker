import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { Store } from "@ngrx/store";
import { NotifierService } from "angular-notifier";
import { UserService } from "src/app/_services/user.service";

@Component({
  selector: "app-super-admin",
  templateUrl: "./super-admin.component.html",
  styleUrls: ["./super-admin.component.scss"]
})
export class SuperAdminComponent {
  private notifier: NotifierService;
  compititionForm: FormGroup;
  public closeResult: string = "";
  constructor(
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private store: Store,
    private userService: UserService,
    notifier: NotifierService,
    private formBuilder: FormBuilder
  ) {
    this.notifier = notifier;

    this.compititionForm = this.formBuilder.group({
      compititionName: ["", Validators.required],
      organiserName: ["", Validators.required],
      organiserContact: ["", Validators.required],
      organiserEmail: ["", Validators.required],
      compititionDescription: ["", Validators.required],
      shortCode: ["", Validators.required],
      compititionLogo: ["", Validators.required],
      compititionBackground: ["", Validators.required],
      compititionColor: ["", Validators.required],
      compititionBorder: ["", Validators.required],
      compititionSeason: ["", Validators.required],
      compititionStart: ["", Validators.required],
      compititionEnd: ["", Validators.required]
    });
  }

  ngOnInit() {}
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
}
