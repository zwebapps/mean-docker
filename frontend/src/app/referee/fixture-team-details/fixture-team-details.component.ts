import { Component, Input, OnInit } from '@angular/core';
import { PlayerService } from 'src/app/_services/player.service';

@Component({
  selector: 'app-fixture-team-details',
  templateUrl: './fixture-team-details.component.html',
  styleUrls: ['./fixture-team-details.component.scss']
})
export class FixtureTeamDetailsComponent implements OnInit {
  @Input() team:any;
  public players: any = [];
  constructor(private playerService: PlayerService) {

  }
ngOnInit(): void {
  if(this.team){
    this.getPlayersByTeam(this.team._id);
  }
}

getPlayersByTeam(id: any) {
this.playerService.getPlayerByTeamId(id).subscribe((res:any) => {
  if(res) {
    this.players = res;
  }
})
}


}
