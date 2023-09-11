import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { UserService } from 'src/app/_services/user.service';
import * as PlayerActions from "../../_store/actions/players.actions";
import * as UserActions from "../../_store/actions/users.actions";
import * as PlayerSelectors from "../../_store/selectors/players.selectors";
import { NotifierService } from 'angular-notifier';
import { StorageService } from 'src/app/_services/storage.service';
import { AcademyService } from 'src/app/_services/academy.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TeamService } from 'src/app/_services/team.service';
import { PlayerService } from 'src/app/_services/player.service';
import { FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-squad-list',
  templateUrl: './squad-list.component.html',
  styleUrls: ['./squad-list.component.scss']
})
export class SquadListComponent implements OnInit {
  @ViewChild('myTable') table:any;
  options = {}
  players:any = [];
  columns:any = [{ prop: 'firstname' }, { name: 'lastname' }, { name: 'dob' } , { name: 'email' }];
  loadingIndicator = true;
  reorderable = true;
  ColumnMode = ColumnMode;
  public teams: any = [];
  private notifier: NotifierService;
  public academies: any = []
  public academy: any = {};
  public currentTeam: any = {};
  public coaches: any = [];
  public leagues: any = [];
  filterLeague: FormGroup;
  constructor(private playerService: PlayerService, private userService: UserService, private storageService: StorageService, notifier: NotifierService, private academyService: AcademyService, private teamService: TeamService, private store: Store, private router: Router,  public activatedRoute: ActivatedRoute){
    this.notifier = notifier;
    this.filterLeague = new FormGroup({
      league: new FormControl('0')
    })
  }

  ngOnInit() {
    let  teamId = this.activatedRoute.snapshot.params['id'];
    // Now get team by id
    this.teamService.getTeamById(teamId).subscribe((res:any) => {
      if(res){
        this.academy = res.academy_id;
        this.currentTeam = res
        if(this.academy.coach){
          this.userById(this.academy.coach);
        }
      }
      this.getPlayersFromStore();
    })
  }

getPlayersFromStore (leagueId?: any) {
  this.store.select(PlayerSelectors.getPlayers).subscribe(players => {
      if(players.length > 0) {
        players.forEach(player => player?.league && !this.alreadyExists(player?.league) ? this.leagues.push(player?.league): null);
        if(!leagueId || leagueId == 0) {
          this.players = players.filter(player => (player?.team?._id == this.currentTeam._id) && (player?.team?.academy_id === this.academy._id));
        } else {
          this.players = players.filter(player => (player?.team?._id == this.currentTeam._id) && (player?.academy._id == this.academy._id && player?.league?._id == leagueId));
        }
      }
    });
  }

  alreadyExists(league: any): boolean {
    return this.leagues.find((l: any) => l._id == league._id) ? true : false
  }
  filterPlayers() {
    let leagueId = this.filterLeague.value.league;
    if(leagueId){
      this.getPlayersFromStore(leagueId);
    }
  }

edit(value: any) {
    this.userService.deleteUser(value).subscribe((result:any)  => {
      this.store.dispatch(UserActions.loadUsers());
    })
  }

  deletePlayer(value: any) {
    this.userService.deleteUser(value).subscribe((result:any)  => {
      this.store.dispatch(UserActions.loadUsers());
    })
  }
  userById(id: any) {
    this.userService.getUserById(id).subscribe((result:any)  => {
      this.coaches = result
    })
  }
  approve(id:any){
    this.playerService.approvePlayer(id, { playerStatus: 'Approved'}).subscribe((result:any)  => {
      if(result) {
        this.notifier.notify('success', 'Player status is approved');
        this.store.dispatch(PlayerActions.loadPlayers());
      }
    })
  }
}
