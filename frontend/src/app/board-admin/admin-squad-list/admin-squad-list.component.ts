import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { UserService } from "src/app/_services/user.service";
import * as PlayerSelectors from "../../_store/selectors/players.selectors";
import { PlayerService } from "src/app/_services/player.service";
import { NotifierService } from "angular-notifier";
import { environment } from "src/environments/environment";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-admin-squad-list",
  templateUrl: "./admin-squad-list.component.html",
  styleUrls: ["./admin-squad-list.component.scss"]
})
export class AdminSquadListComponent {
  private notifier: NotifierService;
  @ViewChild("myTable") table: any;
  @Output() delPlayer = new EventEmitter<string>();
  @Output() approvePlayer = new EventEmitter<string>();
  @Output() editPlayer = new EventEmitter<string>();
  options = {};
  @Input() players: any = [];
  @Input() leaguesFilter: any = [];
  columns: any = [{ prop: "firstname" }, { name: "lastname" }, { name: "username" }, { name: "email" }];
  loadingIndicator = true;
  reorderable = true;
  ColumnMode = ColumnMode;
  public imgSrc: any = null;
  public closeResult: string = "";
  apiURL = environment.apiURL;
  constructor(
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private store: Store,
    private userService: UserService,
    notifier: NotifierService
  ) {
    this.notifier = notifier;
  }

  ngOnInit() {}

  getPlayersFromStore() {
    this.store.select(PlayerSelectors.getPlayers).subscribe((players) => {
      this.players = players;
    });
  }

  edit(value: any) {
    this.editPlayer.emit(value);
  }
  getImage(image: any) {
    return "http://localhost:8080/static/" + image;
  }
  getSantizedUrl = (url: any) => {
    const result = `${this.apiURL}/static/${url}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(result);
  };
  getSantizedpopUpUrl = (url: any) => {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  };

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

  delete(value: any) {
    this.delPlayer.emit(value);
  }
  appPlayer(id: any) {
    this.approvePlayer.emit(id);
  }
}
