import { Component, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { NotifierService } from "angular-notifier";
import { Router, ActivatedRoute } from "@angular/router";
import * as moment from "moment";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { PlayerService } from "src/app/_services/player.service";
import { StorageService } from "src/app/_services/storage.service";
import { TeamService } from "src/app/_services/team.service";
import { UserService } from "src/app/_services/user.service";
import { environment } from "src/environments/environment";
import * as PlayerActions from "../../_store/actions/players.actions";
import * as UserActions from "../../_store/actions/users.actions";
import * as PlayerSelectors from "../../_store/selectors/players.selectors";
import * as LeagueSelectors from "../../_store/selectors/leagues.selectors";
import * as TeamSelectors from "../../_store/selectors/teams.selectors";
import * as AcademySelectors from "../../_store/selectors/academies.selectors";

import * as XLSX from "xlsx";
import { Store } from "@ngrx/store";

@Component({
  selector: "app-admin-players",
  templateUrl: "./admin-players.component.html",
  styleUrls: ["./admin-players.component.scss"]
})
export class AdminPlayersComponent {
  @ViewChild("myTable") table: any;
  active = 1;
  options = {};
  players: any = [];
  columns: any = [{ prop: "firstname" }, { name: "lastname" }, { name: "dob" }, { name: "email" }];
  loadingIndicator = true;
  reorderable = true;
  ColumnMode = ColumnMode;
  public teams: any = [];
  public filterTeams: any = [];
  public teamsForFilter: any = [];
  private notifier: NotifierService;
  public academies: any = [];
  public academy: any = {};
  public currentTeam: any = {};
  public coaches: any = [];
  public leagues: any = [];
  public eidDropdownSettings: IDropdownSettings = {};
  public dropEID: any = [];
  filterLeague: FormGroup;
  squadForm: FormGroup;
  displayAllPlayers: boolean = false;
  public playerForm: FormGroup;
  public dropdownSettings: IDropdownSettings = {};
  public dropdownTeamSettings: IDropdownSettings = {};
  public submitted: boolean = false;
  apiURL = environment.apiURL;
  public eidImages: any = {
    eidFront: null,
    eidBack: null
  };
  playerExists: boolean = false;
  public showPlayerEditForm: boolean = false;
  public playerToEdit: any = {};
  // for playing up dropdown
  public selectedPlayingUp: any = [];
  public selectedPlayingUpTeam: any = [];

  public dropteams: any = [];

  // for all playing up leagues
  public playingUpleagues: any = [];
  public playerPlayingUpTeam: any = [];

  // for selected league
  public selectedLeagues: any = [];
  public eidNo: any = "";
  public selectedEIDs: any = [];
  public searchByNameterm: any = "";
  user: any;
  constructor(
    private storageService: StorageService,
    private playerService: PlayerService,
    private userService: UserService,
    notifier: NotifierService,
    private teamService: TeamService,
    private store: Store,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.user = this.storageService.getUser();
    this.notifier = notifier;
    this.filterLeague = new FormGroup({
      league: new FormControl("0"),
      academy: new FormControl("0"),
      team: new FormControl("0")
    });
    this.squadForm = new FormGroup({
      league: new FormControl("0"),
      academy: new FormControl("0")
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

    this.eidDropdownSettings = {
      singleSelection: false,
      idField: "_id",
      textField: "emiratesIdNo",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    this.dropdownTeamSettings = {
      singleSelection: true,
      idField: "_id",
      textField: "teamName",
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
      team: ["", Validators.required],
      playerEidNo: ["", [Validators.required, Validators.pattern(eidPattern), Validators.maxLength(18)]],
      eidFront: ["", Validators.required],
      eidBack: ["", Validators.required],
      playingUp: [""],
      playingUpTeam: [""]
    });

    // this.playerForm.controls.league.disable();
    this.playerForm.controls.eidFront.disable();
    this.playerForm.controls.eidBack.disable();
    this.getPlayersFromStore();
    this.getLeaguesFromStore();
    this.getTeamsFromStore();
    this.getAcademiesFromStore();
    this.setPlayersList();
  }
  setPlayersList = () => {
    this.displayAllPlayers = !this.displayAllPlayers;
    this.filterLeague.reset();
    this.filterLeague = new FormGroup({
      league: new FormControl("0"),
      academy: new FormControl("0"),
      team: new FormControl("0")
    });
    this.getPlayersFromStore();
  };
  activatePlayers = () => {
    console.log(this.players);
    let selectedPlayers = this.players.filter((player: any) => player.playerStatus === "Pending");
    if (!selectedPlayers.length) {
      this.notifier.notify("error", "All players already activated!");
      return;
    }
    this.playerService.updateMultiplePlayers(selectedPlayers.map((players: any) => players._id)).subscribe(
      (res: any) => {
        if (res && res.message) {
          this.notifier.notify("success", res.message);
          this.filterLeague = new FormGroup({
            league: new FormControl("0"),
            academy: new FormControl("0"),
            team: new FormControl("0")
          });
          this.store.dispatch(PlayerActions.loadPlayers());
        }
      },
      (err) => {
        this.notifier.notify("error", "Please try again!");
      }
    );
  };
  filterPlayersByName(event: any) {
    const name = event.target.value;
    if (name.length > 0) {
      this.searchByNameterm = name;
      this.getPlayersFromStore();
    } else {
      this.searchByNameterm = "";
      this.getPlayersFromStore();
    }
  }
  exportPlayers = () => {
    const fileName = "ExportedPlayers.xlsx";
    const exPlayers = [];
    this.players.forEach((player: any) => {
      const playingUpLeague = this.leagues.filter((league: any) => player.playingUp.includes(league._id)) || [];
      const playingUpTeam = this.filterTeams.filter((team: any) => player?.playingUpTeam.includes(team._id)) || [];
      exPlayers.push({
        Name: `${player.firstName} ${player.lastName}`,
        League: player?.league?.leagueName,
        Academy: player?.academy?.academyName,
        Team: player?.team?.teamName,
        PlayingUpLeague: playingUpLeague.length ? playingUpLeague.map((plUpLeague: any) => plUpLeague?.leagueName).join(",") : "",
        PlayingUpTeam: playingUpTeam.length ? playingUpTeam.map((plTeam: any) => plTeam?.teamName).join(",") : ""
      });
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exPlayers);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Players");

    XLSX.writeFile(wb, fileName);
  };

  getAcademiesFromStore = () => {
    this.store.select(AcademySelectors.getAcademies).subscribe((academies) => {
      if (Array.isArray(academies)) {
        // filter teams for current academy
        this.academies = academies;
      }
    });
  };
  getTeamsFromStore = () => {
    this.store.select(TeamSelectors.getTeams).subscribe((teams) => {
      if (Array.isArray(teams)) {
        // filter teams for current academy
        this.teams = teams.filter((team: any) => team.academy_id?._id === this.academy._id);
        this.filterTeams = teams;
      }
    });
  };
  getLeaguesFromStore = () => {
    this.store.select(LeagueSelectors.getLeagues).subscribe((leagues) => {
      if (Array.isArray(leagues)) {
        this.leagues = leagues;
      }
    });
  };
  get f() {
    return this.playerForm.controls;
  }

  onItemSelect(item: any) {
    if (this.selectedPlayingUp.includes(item._id)) {
      this.selectedPlayingUp.splice(this.selectedPlayingUp.indexOf(item._id), 1);
    } else {
      this.selectedPlayingUp.push(item._id);
    }
    this.dropteams = this.teams.filter((team: any) => this.isLeagueAllowed(this.selectedPlayingUp, team.leagues));
    console.log(this.dropteams);
    this.dropteams = this.dropteams.filter((team: any) => team.academy_id._id === this.academy._id);
  }

  isLeagueAllowed(playerPlayingUp: any, leagues: any) {
    return leagues.some((league: any) => playerPlayingUp.includes(league._id));
  }
  onTeamSelect(item: any) {
    this.playerPlayingUpTeam = [];
    console.log(item);
    this.playerPlayingUpTeam.push(item._id);
  }
  onSelectAll(items: any, type: any) {
    this.selectedPlayingUp.push(items.map((item: any) => item._id));
  }

  getImg = (image: string) => {
    return `${this.apiURL}/static/${image}`;
  };

  editPlayer = (value: any) => {
    this.showPlayerEditForm = true;
    this.playerToEdit = this.players.find((player: any) => player._id === value);
    if (this.playerToEdit) {
      // filter leagues
      this.playingUpleagues = this.leagues.filter(
        (league: any) =>
          moment(this.playerToEdit.dob).isAfter(league.leagueAgeLimit) &&
          moment(this.playerToEdit.league.leagueAgeLimit).isAfter(league.leagueAgeLimit)
      );
      this.selectedPlayingUp = this.leagues.filter((leagues: any) => this.playerToEdit.playingUp.includes(leagues._id));
      if (this.playerToEdit.playingUpTeam && this.playerToEdit.playingUpTeam.length > 0) {
        this.selectedPlayingUpTeam = this.teams.filter((team: any) => this.playerToEdit.playingUpTeam.includes(team._id));
      }
      this.playerForm.patchValue({
        firstName: this.playerToEdit.firstName,
        surName: this.playerToEdit.lastName,
        squadNo: this.playerToEdit.squadNo,
        dob: this.formatDate(this.playerToEdit.dob),
        league: this.playerToEdit.league?._id,
        team: this.playerToEdit.team?._id,
        playerEidNo: this.playerToEdit.emiratesIdNo,
        eidFront: this.playerToEdit.eidFront,
        eidBack: this.playerToEdit.eidBack
      });
      if (this.selectedPlayingUp.length > 0) {
        this.playerForm.patchValue({
          playingUp: this.selectedPlayingUp
        });
      }
      if (this.playerPlayingUpTeam.length > 0) {
        this.playerForm.patchValue({
          playingUpTeam: this.playerPlayingUpTeam
        });
      }
      this.eidNo = this.playerToEdit.emiratesIdNo;
      // this.playerForm.controls.dob.disable();
    }
  };
  submitEditPlayer = () => {
    let plSelectedLeague = this.leagues.find((league: any) => league._id === this.playerForm.value.league);
    let isIlligible = moment(plSelectedLeague.leagueAgeLimit).isSameOrBefore(this.playerForm.value.dob);
    if (!isIlligible) {
      this.notifier.notify("error", "Player is not eligible for selected league!");
      return;
    }
    // emiratesIdNo is filled
    if (this.playerForm.controls.playerEidNo.value) {
      this.playerForm.get("playerEidNo").updateValueAndValidity();
    }
    if (this.playerForm.controls.playingUp.value) {
      this.playerForm.get("playingUp").updateValueAndValidity();
    }
    if (this.playerForm.valid) {
      const playerObj = {
        firstName: this.playerForm.value.firstName,
        surName: this.playerForm.value.surName,
        dob: this.playerForm.value.dob,
        league: this.playerForm.value.league,
        team: this.playerForm.value.team,
        squadNo: this.playerForm.value.squadNo,
        emiratesIdNo: this.playerForm.value.playerEidNo,
        playerStatus: this.playerToEdit.playerStatus,
        playingUp: this.selectedPlayingUp.map((league: any) => league._id),
        playingUpTeam: this.selectedPlayingUpTeam.map((league: any) => league._id),
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
  appendHiphen(event: any) {
    let value = event.target.value;
    // let keyCode = event.keyCode;
    // console.log(keyCode, "keyCode");
    if (value.length === 3) {
      if (value.charAt(value.length - 1) !== "-") {
        this.playerToEdit.emiratesIdNo = `${value}-`;
      }
    }
    if (value.length === 8) {
      if (value.charAt(value.length - 1) !== "-") {
        this.playerToEdit.emiratesIdNo = `${value}-`;
      }
    }

    if (value.length === 16) {
      if (value.charAt(value.length - 1) !== "-") {
        this.eidNo = `${value}-`;
      }
    }
  }
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
  onEidSelect(item: any) {
    this.selectedEIDs.push(item.emiratesIdNo);
    this.getPlayersFromStore();
  }
  onEIDSelectAll(items: any) {
    this.selectedEIDs.push(items.map((eid: any) => eid.emiratesIdNo));
    this.getPlayersFromStore();
  }
  onEIDDeSelect(item: any) {
    this.selectedEIDs.splice(this.selectedEIDs.indexOf(item), 1);
    this.getPlayersFromStore();
  }
  getPlayersFromStore(leagueId?: any, academy?: any) {
    if (!leagueId) {
      leagueId = null;
    }
    if (!academy) {
      academy = null;
    }

    this.store.select(PlayerSelectors.getPlayers).subscribe((players) => {
      if (players.length > 0) {
        if (this.displayAllPlayers) {
          this.players = players;
        } else {
          if (leagueId) {
            this.players = players.filter(
              (player: any) =>
                player?.team?._id == this.currentTeam._id && player?.academy?._id == this.academy?._id && player?.league?._id == leagueId
            );
          } else {
            this.players = players.filter(
              (player: any) => player?.team?._id == this.currentTeam._id && player?.team?.academy_id === this.academy._id
            );
          }
          // condition for emiratesId
          if (this.selectedEIDs.length > 0) {
            this.players = this.players.filter((player: any) => this.selectedEIDs.includes(player.emiratesIdNo));
          }
          // filter by name
          if (this.searchByNameterm) {
            this.players = this.players.filter(
              (player: any) =>
                player?.firstName?.toLowerCase().includes(this.searchByNameterm.toLowerCase()) ||
                player?.lastName?.toLowerCase().includes(this.searchByNameterm.toLowerCase())
            );
          }
          this.dropEID = players;
        }
      }
    });
  }
  filterAllPlayers() {
    this.getPlayersFromStore();
    let leagueId = null;
    let academy = null;
    let team = null;
    if (this.filterLeague.value.league && this.filterLeague.value.league !== "0") {
      leagueId = this.filterLeague.value.league;
    }
    if (this.filterLeague.value.academy && this.filterLeague.value.academy !== "0") {
      academy = this.filterLeague.value.academy;
      this.teamsForFilter = this.filterTeams.filter((team: any) => team?.academy_id?._id === this.filterLeague.value.academy);
    }
    if (this.filterLeague.value.team && this.filterLeague.value.team !== "0") {
      team = this.filterLeague.value.team;
    }
    this.store.select(PlayerSelectors.getPlayers).subscribe((players) => {
      if (players.length > 0) {
        this.players = players;
        if (leagueId) {
          this.players = this.players.filter((player: any) => player?.league?._id === leagueId || player?.playingUp?.includes(leagueId));
        }
        if (academy) {
          this.players = this.players.filter((player: any) => player?.academy?._id === academy);
        }
        if (team) {
          this.players = this.players.filter((player: any) => player?.team?._id === team || player?.playingUpTeam?.includes(team));
        }
        if (!leagueId && !academy && !team) {
          this.players = players;
        }
      }
    });
  }

  uploadEmiratesID(event: any) {
    const file: File = event.target.files[0];
    const inputName = event.target.name;
    this.playerService.upload(file).subscribe(
      (res: any) => {
        if (res) {
          this.eidImages[inputName] = res.filename;
          try {
            this.notifier.notify("success", `${res.message}`);
          } catch (error) {
            console.log(error);
          }
        }
      },
      (err) => {
        this.notifier.notify("error", "Please try again!");
      }
    );
  }
  playerbyEmirateId(event: any) {
    const id = event.target.value;
    if (id && id.length > 17) {
      const pattern = new RegExp("^\\d\\d\\d\\-\\d\\d\\d\\d\\-\\d\\d\\d\\d\\d\\d\\d\\-\\d$", "gm");
      if (pattern.test(id)) {
        this.playerService.getPlayerbyEmirateId(id).subscribe(
          (res) => {
            if (res._id || res._emiratesIdNo) {
              this.playerExists = true;
              // this.notifier.notify("error", "Player having this Emirates ID already exists!");
            } else {
              this.playerExists = false;
            }
          },
          (err) => {
            this.notifier.notify("error", "Please try again!");
          }
        );
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
    let leagueId = null;
    let academyId = null;
    if (this.filterLeague.value.academy && this.filterLeague.value.academy !== "0") {
      academyId = this.filterLeague.value.academy;
    }
    if (this.filterLeague.value.league && this.filterLeague.value.league !== "0") {
      leagueId = this.filterLeague.value.league;
    }

    this.getPlayersFromStore(leagueId, academyId);
  }

  edit(value: any) {
    this.userService.deleteUser(value).subscribe((result: any) => {
      this.store.dispatch(UserActions.loadUsers());
    });
  }

  deletePlayer(value: any) {
    this.playerService.deletePlayer(value).subscribe(
      (result: any) => {
        if (result) {
          this.notifier.notify(result.type, result.message);
        }
        this.store.dispatch(PlayerActions.loadPlayers());
      },
      (err) => {
        this.notifier.notify("error", "Please try again!");
      }
    );
  }
  userById(id: any) {
    this.userService.getUserById(id).subscribe(
      (result: any) => {
        if (!result.message) {
          this.coaches = Array.isArray(result) ? result : [result];
        } else {
          this.notifier.notify("error", "Coach not found");
        }
      },
      (err) => {
        this.notifier.notify("error", "Please try again!");
      }
    );
  }
  approve(id: any) {
    this.playerService.approvePlayer(id, { playerStatus: "Approved" }).subscribe(
      (result: any) => {
        if (result) {
          this.notifier.notify("success", "Player status is approved");
          this.store.dispatch(PlayerActions.loadPlayers());
        }
      },
      (err) => {
        this.notifier.notify("error", "Please try again!");
      }
    );
  }
  redirectTo() {
    this.router.navigate([`${this.user.shortcode}/admin/squads`]);
  }
}
