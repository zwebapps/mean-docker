import { Component, Input, OnInit } from "@angular/core";
import { PlayerService } from "src/app/_services/player.service";
import { environment } from "src/environments/environment";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-fixture-team-details",
  templateUrl: "./fixture-team-details.component.html",
  styleUrls: ["./fixture-team-details.component.scss"]
})
export class FixtureTeamDetailsComponent implements OnInit {
  @Input() team: any;
  apiURL = environment.apiURL;
  closeResult: string = "";
  public imgSrc: any = null;
  public players: any = [];
  constructor(private modalService: NgbModal, private playerService: PlayerService) {}
  ngOnInit(): void {
    if (this.team) {
      this.getPlayersByTeam(this.team._id);
    }
  }

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

  getPlayersByTeam(id: any) {
    this.playerService.getPlayerByTeamId(id).subscribe((res: any) => {
      if (res) {
        this.players = res;
      }
    });
  }
}
