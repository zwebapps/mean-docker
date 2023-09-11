import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { UserService } from 'src/app/_services/user.service';
import * as PlayerSelectors from "../../_store/selectors/players.selectors";
import { PlayerService } from 'src/app/_services/player.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-admin-squad-list',
  templateUrl: './admin-squad-list.component.html',
  styleUrls: ['./admin-squad-list.component.scss']
})
export class AdminSquadListComponent {
  private notifier: NotifierService;
  @ViewChild('myTable') table:any;
  @Output() delPlayer = new EventEmitter<string>();
  @Output() approvePlayer = new EventEmitter<string>();
  options = {}
  @Input() players:any = [];
  @Input() leaguesFilter: any = [];
  columns:any = [{ prop: 'firstname' }, { name: 'lastname' }, { name: 'username' } , { name: 'email' }];
  loadingIndicator = true;
  reorderable = true;
  ColumnMode = ColumnMode;
  constructor(private store: Store, private userService: UserService, notifier: NotifierService) {
    this.notifier = notifier
  }

  ngOnInit() {

  }

  getPlayersFromStore () {
    this.store.select(PlayerSelectors.getPlayers).subscribe(players => {
      this.players = players;
     });
  }

  edit(value: any) {
    // this.userService.deleteUser(value).subscribe((result:any)  => {
      console.log(value)
    // })
  }
  getImage(image:any){
    return "http://localhost:8080/static/"+image;
  }

  delete(value: any) {
    this.delPlayer.emit(value);
  }
  appPlayer(id: any) {
   this.approvePlayer.emit(id);
  }

}
