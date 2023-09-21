import { Component, OnInit, ViewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { UserService } from "src/app/_services/user.service";
import * as PlayerActions from "../../_store/actions/players.actions";
import * as UserActions from "../../_store/actions/users.actions";
import * as PlayerSelectors from "../../_store/selectors/players.selectors";
import { NotifierService } from "angular-notifier";
import { StorageService } from "src/app/_services/storage.service";
import { AcademyService } from "src/app/_services/academy.service";
import { Router, ActivatedRoute } from "@angular/router";
import { TeamService } from "src/app/_services/team.service";
import { PlayerService } from "src/app/_services/player.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-squad-list",
  templateUrl: "./squad-list.component.html",
  styleUrls: ["./squad-list.component.scss"]
})
export class SquadListComponent implements OnInit {
  @ViewChild("myTable") table: any;
  options = {};
  players: any = [];
  columns: any = [{ prop: "firstname" }, { name: "lastname" }, { name: "dob" }, { name: "email" }];
  loadingIndicator = true;
  reorderable = true;
  ColumnMode = ColumnMode;
  public teams: any = [];
  private notifier: NotifierService;
  public academies: any = [];
  public academy: any = {};
  public currentTeam: any = {};
  public coaches: any = [];
  public leagues: any = [];
  filterLeague: FormGroup;
  public playerForm: FormGroup;
  public dropdownSettings: IDropdownSettings = {};
  public submitted: boolean = false;
  apiURL = environment.apiURL;
  public eidImages: any = {
    eidFront: null,
    eidBack: null
  };
  playerExists: boolean = false;
  public showPlayerEditForm: boolean = false;
  public playerToEdit: any = {};
  public selectedPlayingUp: any = [];
  constructor(
    private playerService: PlayerService,
    private userService: UserService,
    private storageService: StorageService,
    notifier: NotifierService,
    private academyService: AcademyService,
    private teamService: TeamService,
    private store: Store,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.notifier = notifier;
    this.filterLeague = new FormGroup({
      league: new FormControl("0")
    });
  }

  ngOnInit() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: "_id",
      textField: "leagueName",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    const eidPattern = new RegExp("^\\d\\d\\d\\-\\d\\d\\d\\d\\-\\d\\d\\d\\d\\d\\d\\d\\-\\d$", "gm");
    this.playerForm = this.formBuilder.group({
      firstName: ["", Validators.required],
      surName: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      squadNo: ["", [Validators.required, Validators.minLength(1), Validators.maxLength(3)]],
      dob: ["", Validators.required],
      league: ["", Validators.required],
      playerEidNo: ["", [Validators.required, Validators.pattern(eidPattern), Validators.maxLength(18)]],
      eidFront: ["", Validators.required],
      eidBack: ["", Validators.required],
      playingUp: ["", Validators.required]
    });

    this.playerForm.controls.league.disable();
    this.playerForm.controls.eidFront.disable();
    this.playerForm.controls.eidBack.disable();

    let teamId = this.activatedRoute.snapshot.params["id"];
    // Now get team by id
    this.teamService.getTeamById(teamId).subscribe((res: any) => {
      if (res) {
        this.academy = res.academy_id;
        this.currentTeam = res;
        if (this.academy.coach) {
          this.userById(this.academy.coach);
        }
      }
      this.getPlayersFromStore();
    });
  }
  get f() {
    return this.playerForm.controls;
  }

  onItemSelect(item: any) {
    if (this.selectedPlayingUp.includes(item._id)) {
      this.selectedPlayingUp.splice(this.selectedPlayingUp.indexOf(item._id), 1);
    } else {
      this.selectedPlayingUp.push(item._id);
    }
  }
  onSelectAll(items: any) {
    this.selectedPlayingUp.push(items.map((item: any) => item._id));
  }

  getImg = (image: string) => {
    return `${this.apiURL}/static/${image}`;
  };

  editPlayer = (value: any) => {
    this.showPlayerEditForm = true;
    this.playerToEdit = this.players.find((player: any) => player._id === value);
    if (this.playerToEdit) {
      this.selectedPlayingUp = this.leagues.filter((leagues: any) => this.playerToEdit.playingUp.includes(leagues._id));
      this.playerForm.patchValue({
        firstName: this.playerToEdit.firstName,
        surName: this.playerToEdit.lastName,
        squadNo: this.playerToEdit.squadNo,
        dob: this.formatDate(this.playerToEdit.dob),
        league: this.playerToEdit.league?.leagueName,
        playerEidNo: this.playerToEdit.emiratesIdNo,
        eidFront: this.playerToEdit.eidFront,
        eidBack: this.playerToEdit.eidBack,
        playingUp: this.selectedPlayingUp
      });

      this.playerForm.controls.dob.disable();
    }
  };
  submitEditPlayer = () => {
    if (this.playerForm.valid) {
      const playerObj = {
        firstName: this.playerForm.value.firstName,
        surName: this.playerForm.value.surName,
        dob: this.playerForm.value.dob,
        squadNo: this.playerForm.value.squadNo,
        emiratesIdNo: this.playerForm.value.playerEidNo,
        playerStatus: this.playerToEdit.playerStatus,
        playingUp: this.selectedPlayingUp.map((league: any) => league._id),
        user: {
          createdBy: this.playerToEdit.user?._id
        }
      };

      this.playerService.updatePlayer(this.playerToEdit._id, playerObj).subscribe((result: any) => {
        console.log(result);
        if (result) {
          this.notifier.notify("success", result.message);
          this.showPlayerEditForm = false;
          this.store.dispatch(PlayerActions.loadPlayers());
        }
      });
    }
  };
  getCalculateAge = (value) => {
    const dob = new Date(value);
    let ageDifMs = Date.now() - dob.getTime();
    let ageDate = new Date(ageDifMs);
    let age = Math.abs(ageDate.getUTCFullYear() - 1970);
    return age;
  };
  calculateAge = (value: any) => {
    const dob = new Date(value);
    let ageDifMs = Date.now() - dob.getTime();
    let ageDate = new Date(ageDifMs);
    let age = Math.abs(ageDate.getUTCFullYear() - 1970);
  };
  getAgeFromName(leagueName: any) {
    let nameArray = leagueName.match(/(\d+)/);
    return nameArray.find((nm: any) => !isNaN(nm));
  }
  getPlayersFromStore(leagueId?: any) {
    this.leagues = [];
    this.store.select(PlayerSelectors.getPlayers).subscribe((players) => {
      if (players.length > 0) {
        players.forEach((player) => (player?.league && !this.alreadyExists(player?.league) ? this.leagues.push(player?.league) : null));
        if (!leagueId || leagueId == 0) {
          this.players = players.filter(
            (player) => player?.team?._id == this.currentTeam._id && player?.team?.academy_id === this.academy._id
          );
        } else {
          this.players = players.filter(
            (player) =>
              player?.team?._id == this.currentTeam._id && player?.academy?._id == this.academy?._id && player?.league?._id == leagueId
          );
        }
      }
    });
  }

  uploadEmiratesID(event: any) {
    const file: File = event.target.files[0];
    const inputName = event.target.name;
    this.playerService.upload(file).subscribe((res: any) => {
      if (res) {
        this.eidImages[inputName] = res.filename;
        try {
          this.notifier.notify("success", `${res.message}`);
        } catch (error) {
          console.log(error);
        }
      }
    });
  }
  playerbyEmirateId(event: any) {
    const id = event.target.value;
    if (id && id.length > 17) {
      const pattern = new RegExp("^\\d\\d\\d\\-\\d\\d\\d\\d\\-\\d\\d\\d\\d\\d\\d\\d\\-\\d$", "gm");
      if (pattern.test(id)) {
        this.playerService.getPlayerbyEmirateId(id).subscribe((res) => {
          if (res._id || res._emiratesIdNo) {
            this.playerExists = true;
            // this.notifier.notify("error", "Player having this Emirates ID already exists!");
          } else {
            this.playerExists = false;
          }
        });
      }
    }
  }

  private formatDate(date) {
    const d = new Date(date);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [year, month, day].join("-");
  }

  alreadyExists(league: any): boolean {
    return this.leagues.find((l: any) => l._id == league._id) ? true : false;
  }
  filterPlayers() {
    let leagueId = this.filterLeague.value.league;
    if (leagueId) {
      this.getPlayersFromStore(leagueId);
    }
  }

  edit(value: any) {
    this.userService.deleteUser(value).subscribe((result: any) => {
      this.store.dispatch(UserActions.loadUsers());
    });
  }

  deletePlayer(value: any) {
    this.playerService.deletePlayer(value).subscribe((result: any) => {
      if (result) {
        this.notifier.notify(result.type, result.message);
      }
      this.store.dispatch(PlayerActions.loadPlayers());
    });
  }
  userById(id: any) {
    this.userService.getUserById(id).subscribe((result: any) => {
      if (!result.message) {
        this.coaches = result;
      }
    });
  }
  approve(id: any) {
    this.playerService.approvePlayer(id, { playerStatus: "Approved" }).subscribe((result: any) => {
      if (result) {
        this.notifier.notify("success", "Player status is approved");
        this.store.dispatch(PlayerActions.loadPlayers());
      }
    });
  }
}
