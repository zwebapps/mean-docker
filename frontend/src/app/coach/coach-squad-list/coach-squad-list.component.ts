import { Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { UserService } from "src/app/_services/user.service";
import * as PlayerSelectors from "../../_store/selectors/players.selectors";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-coach-squad-list",
  templateUrl: "./coach-squad-list.component.html",
  styleUrls: ["./coach-squad-list.component.scss"]
})
export class CoachSquadListComponent {
  @ViewChild("myTable") table: any;
  @Output() delPlayer = new EventEmitter<string>();
  options = {};
  @Input() players: any = [];
  columns: any = [{ prop: "firstname" }, { name: "lastname" }, { name: "username" }, { name: "email" }];
  loadingIndicator = true;
  reorderable = true;
  ColumnMode = ColumnMode;
  apiURL = environment.apiURL;
  closeResult = "";
  public imgSrc: any = null;
  constructor(private modalService: NgbModal, private store: Store, private userService: UserService, private router: Router) {}

  ngOnInit() {}

  open(content: any, imgSrc: any) {
    this.imgSrc = `${this.apiURL}/static/${imgSrc}`;
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

  edit(value: any) {
    // this.userService.deleteUser(value).subscribe((result:any)  => {
    console.log(value);
    // })
  }

  delete(value: any) {
    this.delPlayer.emit(value);
  }
  redirectTo() {
    this.router.navigate(["/admin/academies"]);
  }
}
