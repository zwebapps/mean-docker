import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { PlayerService } from "src/app/_services/player.service";
import { environment } from "src/environments/environment";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NotifierService } from "angular-notifier";
import { FixtureService } from "src/app/_services/fixture.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-fixture-team-details",
  templateUrl: "./fixture-team-details.component.html",
  styleUrls: ["./fixture-team-details.component.scss"]
})
export class FixtureTeamDetailsComponent implements OnInit {
  private notifier: NotifierService;
  @Input() team: any;
  @Input() league: any;
  @Input({ required: false }) fixture: any;
  public mvpPlayer: any = null;
  apiURL = environment.apiURL;
  closeResult: string = "";
  public imgSrc: any = null;
  public players: any = [];
  constructor(
    notifier: NotifierService,
    private modalService: NgbModal,
    private playerService: PlayerService,
    private fixtureService: FixtureService,
    private router: Router
  ) {
    this.notifier = notifier;
  }
  ngOnInit(): void {
    if (this.team) {
      this.getPlayersByTeam(this.team._id);
    }
    if (this.fixture) {
      this.mvpPlayer = this.fixture.mvp;
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
    this.playerService.getPlayerByTeamId(id).subscribe(
      (res: any) => {
        if (Array.isArray(res)) {
          // filters players based on league for which they are added or playing up also
          this.players = res.filter(
            (player) =>
              (player.league && player?.league?._id === this.league?._id) ||
              player?.playingUp.includes(this.league?._id) ||
              player?.playingUpTeam.includes(id)
          );
        } else {
          this.notifier.notify("error", "Players not found!");
        }
      },
      (err) => {
        console.log(err);
        this.notifier.notify("error", "Please try again!");
      }
    );
  }
  addMvp = (player: any) => {
    this.mvpPlayer = null;
    this.fixtureService
      .updateFixture(this.fixture._id, {
        mvp: player?._id
      })
      .subscribe((res: any) => {
        if (res) {
          this.mvpPlayer = res.mvp;
          this.notifier.notify("success", "Fixture is updated successfully!");
          if (typeof window !== "undefined") {
            window.location.reload();
          }
        }
      });
  };
}
