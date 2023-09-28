import { Component, ElementRef, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { UserService } from "src/app/_services/user.service";
import * as UserActions from "../../_store/actions/users.actions";
import * as PlayerActions from "../../_store/actions/players.actions";
import * as PlayerSelectors from "../../_store/selectors/players.selectors";
import * as LeagueSelectors from "../../_store/selectors/leagues.selectors";
import { TeamService } from "../../_services/team.service";
import { NotifierService } from "angular-notifier";
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { StorageService } from "src/app/_services/storage.service";
import { PlayerService } from "src/app/_services/player.service";
import { ConfirmationDialogService } from "src/app/_services/confirmation-dialog.service";
import * as TeamSelectors from "../../_store/selectors/teams.selectors";
import * as AcademiesSelectors from "../../_store/selectors/academies.selectors";

import * as XLSX from "xlsx";
import * as moment from "moment";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { environment } from "src/environments/environment";
const { read, write, utils } = XLSX;

@Component({
  selector: "app-coach-academy-details",
  templateUrl: "./coach-academy-details.component.html",
  styleUrls: ["./coach-academy-details.component.scss"]
})
export class CoachAcademyDetailsComponent {
  @ViewChild("myTable") table: any;
  @ViewChild("csvUpload") csvUploadVar: ElementRef;
  excelData: any = [
    [1, 2],
    [3, 4]
  ];
  wopts: XLSX.WritingOptions = { bookType: "xlsx", type: "array" };
  fileName: string = "SheetJS.xlsx";
  private notifier: NotifierService;
  eidNo: any = "";
  options = {};
  data: any = [];
  columns: any = [{ prop: "firstname" }, { name: "lastname" }, { name: "dob" }, { name: "email" }];
  loadingIndicator = true;
  reorderable = true;
  ColumnMode = ColumnMode;
  public academy: any = {};
  public team: any = {};
  public leagues: any = [];
  public playerForm: FormGroup;
  public coach: any = {};
  public selectedLeague: any = null;
  public submitted: boolean = false;
  public eidStaticNo = "784-1234-1234567-1";
  public file: File | undefined;
  public images: any = [];
  public dropleagues: any = [];
  public dropdownSettings: IDropdownSettings = {};
  public playerPlayingUp: any = [];
  public eidImages: any = {
    eidFront: null,
    eidBack: null
  };
  emiratesIdPattern = "^ddd-dddd-ddddddd-d$";
  playerExists: boolean = false;
  teams: any = [];
  academies: any = [];
  insertionStarted: boolean = false;
  apiURL = environment.apiURL;
  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private teamService: TeamService,
    notifier: NotifierService,
    private storageService: StorageService,
    private palyerService: PlayerService,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    this.notifier = notifier;
    this.submitted = false;
    this.playerForm = new FormGroup({
      firstName: new FormControl(""),
      surName: new FormControl(""),
      squadNo: new FormControl(""),
      dob: new FormControl(""),
      league: new FormControl(""),
      playerEidNo: new FormControl(""),
      eidFront: new FormControl(""),
      eidBack: new FormControl(""),
      playingUp: new FormControl("")
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
      playerEidNo: [null, [Validators.required, Validators.pattern(eidPattern), Validators.maxLength(18)]],
      eidFront: ["", Validators.required],
      eidBack: ["", Validators.required],
      playingUp: [""]
    });
    this.playerForm.controls.league.disable();
    // get the team id
    let teamId = this.activatedRoute.snapshot.params["id"];
    // Now get team by id
    this.teamService.getTeamById(teamId).subscribe(
      (res: any) => {
        if (!res.message) {
          this.academy = res.academy_id;
          this.team = res;
          this.leagues = res.leagues;
          if (this.leagues.length > 0) {
            this.leagues = this.leagues.map((league: any) => {
              return {
                ...league,
                selected: false
              };
            });
          }
          this.getPlayersFromStore();
        } else {
          this.notifier.notify("Error", "Academy not found!");
        }
      },
      (error: any) => {
        this.notifier.notify("Error", "Academy not found!");
      }
    );
    // this.getLeaguesFromStore();
    this.getAcademiesFromStore();
    this.getTeamsFromStore();
    // get logged in coach
    this.coach = this.storageService.getUser();
    if (this.storageService.getUser()) {
      const coachId = this.storageService.getUser()?.id;
      this.userService.getUserById(coachId).subscribe(
        (res: any) => {
          if (res) {
            this.coach = res;
          }
        },
        (err) => {
          this.notifier.notify("error", "Please try again!");
        }
      );
    }
    // get all the saved files
    this.palyerService.getListFiles().subscribe(
      (res: any) => {
        if (res) {
          this.images = res;
        }
      },
      (err) => {
        this.notifier.notify("error", "Please try again!");
      }
    );
  }
  getImg = (image: string) => {
    return `${this.apiURL}/static/${image}`;
  };
  resetCsvUploads() {
    this.csvUploadVar.nativeElement.value = "";
  }
  onFormSubmit = () => {
    this.submitted = true;

    if (this.playerForm.invalid) {
      this.notifier.notify("error", "Please fill all the required fields!");
      return;
    } else if (!this.selectedLeague) {
      this.notifier.notify("error", "League is not selected!");
      return;
    } else {
      let isIlligible = moment(this.selectedLeague.leagueAgeLimit).isSameOrBefore(this.playerForm.value.dob);
      if (!isIlligible) {
        this.notifier.notify("error", "You are not eligible for this league!");
        return;
      }
      const playerObj = {
        firstName: this.playerForm.value.firstName,
        surName: this.playerForm.value.surName,
        dob: this.playerForm.value.dob,
        squadNo: this.playerForm.value.squadNo,
        league: this.selectedLeague._id,
        academy: this.academy._id,
        team: this.team._id,
        playerImage: this.playerForm.value.playerImage,
        eidNo: this.playerForm.value.playerEidNo,
        eidFront: this.eidImages.eidFront,
        eidBack: this.eidImages.eidBack,
        status: "Pending",
        playingUp: this.playerPlayingUp,
        user: {
          createdBy: this.coach.id
        }
      };

      this.palyerService.createPlayer(playerObj).subscribe(
        (res: any) => {
          if (res) {
            this.notifier.notify("success", res.message);
            this.playerForm.reset();
            this.submitted = false;
            this.store.dispatch(PlayerActions.loadPlayers());
            this.getPlayersFromStore();
            if (this.selectedLeague) {
              this.data = this.data.filter((player: any) => player.league?._id === this.selectedLeague?._id);
            }
          }
        },
        (err) => {
          this.notifier.notify("error", "Please try again!");
        }
      );
    }
  };
  getPlayersFromStore() {
    this.store.select(PlayerSelectors.getPlayers).subscribe(
      (players) => {
        this.data = players.filter((player) => player.academy);
        this.data = this.data.filter(
          (player: any) =>
            player.team && player.team._id === this.team._id && player.team.academy_id && player.team.academy_id === this.academy._id
        );
      },
      (err) => {
        this.notifier.notify("error", "Please try again!");
      }
    );
  }
  getLeaguesFromStore() {
    // getting leagues
    this.store.select(LeagueSelectors.getLeagues).subscribe(
      (leagues) => {
        if (leagues) {
          this.leagues = leagues.map((league: any) => {
            return {
              ...league,
              selected: false
            };
          });
        }
      },
      (err) => {
        this.notifier.notify("error", "Please try again!");
      }
    );
  }
  getTeamsFromStore() {
    // getting leagues
    this.store.select(TeamSelectors.getTeams).subscribe(
      (teams) => {
        if (teams) {
          this.teams = teams;
        }
      },
      (err) => {
        this.notifier.notify("error", "Please try again!");
      }
    );
  }
  getAcademiesFromStore() {
    // getting leagues
    this.store.select(AcademiesSelectors.getAcademies).subscribe(
      (academies) => {
        if (academies) {
          this.academies = academies;
        }
      },
      (err) => {
        this.notifier.notify("error", "Please try again!");
      }
    );
  }
  edit(value: any) {
    this.userService.deleteUser(value).subscribe(
      (result: any) => {
        this.store.dispatch(UserActions.loadUsers());
      },
      (err) => {
        this.notifier.notify("error", "Please try again!");
      }
    );
  }

  deletePlayer(value: any) {
    this.palyerService.deletePlayer(value).subscribe(
      (result: any) => {
        if (result) {
          this.notifier.notify(result.type, result.message);
          this.store.dispatch(PlayerActions.loadPlayers());
          this.data = [];
          this.getPlayersFromStore();
        }
      },
      (err) => {
        this.notifier.notify("error", "Please try again!");
      }
    );
  }
  onCheckBox(lg: any) {
    this.playerForm.patchValue({
      playingUp: ""
    });

    this.selectedLeague = lg;
    this.playerForm.patchValue({
      league: this.selectedLeague.name
    });

    this.leagues = this.leagues.map((league: any) => {
      return {
        ...league,
        selected: lg._id === league._id ? true : false
      };
    });
    // filter leagues to display elder leagues
    this.dropleagues = this.leagues.filter((league: any) => !league.selected);
    if (this.playerForm.controls.dob.valid) {
      // filter on selected league and dob
      this.dropleagues = this.leagues.filter(
        (league: any) =>
          moment(this.playerForm.controls.dob.value).isAfter(league.leagueAgeLimit) &&
          moment(this.selectedLeague.leagueAgeLimit).isAfter(league.leagueAgeLimit)
      );
    } else {
      // filter only selected league
      this.dropleagues = this.leagues.filter((league: any) => moment(this.selectedLeague.leagueAgeLimit).isAfter(league.leagueAgeLimit));
    }
    if (this.selectedLeague) {
      this.getPlayersFromStore();
      this.data = this.data.filter((player: any) => player.league?._id === this.selectedLeague?._id);
    }
  }
  onItemSelect(item: any) {
    if (this.playerPlayingUp.includes(item._id)) {
      this.playerPlayingUp.splice(this.playerPlayingUp.indexOf(item._id), 1);
    } else {
      this.playerPlayingUp.push(item._id);
    }
  }
  onSelectAll(items: any) {
    this.playerPlayingUp = items.map((item: any) => item._id);
  }
  uploadEmiratesID(event: any) {
    const file: File = event.target.files[0];
    const inputName = event.target.name;
    this.palyerService.upload(file).subscribe(
      (res: any) => {
        if (res) {
          this.eidImages[inputName] = res.filename;
          try {
            this.notifier.notify("success", `${res.message}`);
            this.store.dispatch(PlayerActions.loadPlayers());
            this.getPlayersFromStore();
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
  getImages = (event: any) => {
    const file: File[] = event.target.files;
    console.log(event.target.files);
    this.palyerService.uploadImages(file).subscribe({
      next: (res: any) => {
        if (res && res.count > 0) {
          try {
            this.notifier.notify("success", `Successfully uploaded ${res.count} images!`);
            this.store.dispatch(PlayerActions.loadPlayers());
            this.getPlayersFromStore();
          } catch (error) {
            console.log(error);
          }
        }
      },
      error: (error: any) => {
        this.notifier.notify("error", `error:  ${error?.message}!`);
      },
      complete: () => {}
    });
  };

  get f() {
    return this.playerForm.controls;
  }

  getAge(dob: any) {
    const birth = new Date(new Date(dob).getFullYear(), new Date(dob).getMonth() - 1, new Date(dob).getDay());
    const now = new Date();
    const diff = new Date(now.valueOf() - birth.valueOf());
    return Math.abs(diff.getFullYear() - 1970);
  }

  getAgeFromName(leagueName: any) {
    let nameArray = leagueName.match(/(\d+)/);
    return nameArray.find((nm: any) => !isNaN(nm));
  }

  onDeletePlayer(leagueId: any) {
    this.openConfirmationDialog(leagueId);
  }

  public openConfirmationDialog(id: any) {
    this.confirmationDialogService
      .confirm("Please confirm", "Do you really want to delete Player?")
      .then((confirmed) => this.deletePlayer(id))
      .catch(() => console.log("User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)"));
  }

  // if eid already exist
  playerbyEmirateId(event: any) {
    const id = event.target.value;
    if (id && id.length > 17) {
      const pattern = new RegExp("^\\d\\d\\d\\-\\d\\d\\d\\d\\-\\d\\d\\d\\d\\d\\d\\d\\-\\d$", "gm");
      if (pattern.test(id)) {
        this.palyerService.getPlayerbyEmirateId(id).subscribe(
          (res) => {
            if (res._id || res._emiratesIdNo) {
              this.playerExists = true;
              this.notifier.notify("error", "Player having this Emirates ID already exists!");
            } else {
              this.playerExists = false;
            }
          },
          (err) => {
            console.log("Emirates id is wrong", err);
          }
        );
      }
    }
  }

  onChange(evt: any) {
    if (!this.selectedLeague) {
      this.notifier.notify("error", "Please select a league!");
      this.resetCsvUploads();
      return;
    }
    console.log(this.team, this.academy);
    this.insertionStarted = true;
    let workBook: any = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = evt.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: "binary", cellDates: true });
      jsonData = workBook.SheetNames.reduce((initial: any, name: any) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      const dataString: any = JSON.parse(JSON.stringify(jsonData));

      dataString["Sheet1"] = dataString["Sheet1"].map((player: any) => {
        return {
          ...player,
          DOB: player.DOB.includes("/")
            ? new Date(player.DOB.split("/").reverse().join("-")).toLocaleDateString()
            : new Date(player.DOB).toLocaleDateString(),
          Team: this.team._id,
          Academy: this.academy._id,
          League: this.selectedLeague._id,
          User: this.coach
        };
      });
      // check to filter players elder than selected league
      dataString["Sheet1"] = dataString["Sheet1"].filter(
        (player: any) => this.getCalculateAge(this.selectedLeague.leagueAgeLimit) >= this.getCalculateAge(player.DOB)
      );
      if (dataString["Sheet1"].length > 0) {
        this.notifier.notify("info", `Importing players...`);
        this.palyerService.importPlayers(dataString["Sheet1"]).subscribe(
          (res: any) => {
            this.insertionStarted = false;
            if (res && res.players) {
              this.notifier.notify("success", `${res.players.length} Players added`);
              this.store.dispatch(PlayerActions.loadPlayers());
              this.getPlayersFromStore();
            } else {
              this.notifier.notify("error", res.message);
            }
          },
          (err) => {
            this.notifier.notify("error", "Please try again!");
          }
        );
      } else {
        this.notifier.notify("error", "No players is eligible for selected league!");
        this.resetCsvUploads();
        return;
      }
    };
    reader.readAsBinaryString(file);
  }
  onContactUs = () => {
    this.router.navigate(["/coach/contacts"]);
  };

  appendHiphen(event: any) {
    let value = event.target.value;
    // let keyCode = event.keyCode;
    // console.log(keyCode, "keyCode");
    if (value.length === 3) {
      if (value.charAt(value.length - 1) !== "-") {
        this.eidNo = `${value}-`;
      }
    }
    if (value.length === 8) {
      if (value.charAt(value.length - 1) !== "-") {
        this.eidNo = `${value}-`;
      }
    }

    if (value.length === 16) {
      if (value.charAt(value.length - 1) !== "-") {
        this.eidNo = `${value}-`;
      }
    }
  }
  export(): void {
    let link = document.createElement("a");
    link.setAttribute("type", "hidden");
    link.href = "../../../assets/excel/Example Squad List.xlsx";
    link.download = "Example Squad List.xlsx";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  getCalculateAge = (value: any) => {
    if (value) {
      if (value.includes("/")) {
        value = value.split("/").reverse().join("-");
      }
      const dob = new Date(value);
      let ageDifMs = Date.now() - dob.getTime();
      let ageDate = new Date(ageDifMs);
      let age = Math.abs(ageDate.getUTCFullYear() - 1970);
      // console.log(age, "::::::", value);
      return age;
    }
  };
  getMaxAgeLeagues = (value: any) => {
    const dob = new Date(value);
    let ageDifMs = Date.now() - dob.getTime();
    let ageDate = new Date(ageDifMs);
    let age = Math.abs(ageDate.getUTCFullYear() - 1970);
    if (this.selectedLeague) {
      // filter on selected league and dob
      this.dropleagues = this.leagues.filter(
        (league: any) =>
          moment(this.playerForm.controls.dob.value).isAfter(league.leagueAgeLimit) &&
          moment(this.selectedLeague.leagueAgeLimit).isAfter(league.leagueAgeLimit)
      );
    }
  };
  redirectTo() {
    this.router.navigate(["/coach/teams"]);
  }
}
