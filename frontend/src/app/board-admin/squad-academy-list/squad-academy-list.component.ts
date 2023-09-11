import { Component, OnInit } from '@angular/core';
import * as AcademyActions from "../../_store/actions/academies.actions";
// importing selectors
import * as AcademySelectors from "../../_store/selectors/academies.selectors";
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { AcademyService } from 'src/app/_services/academy.service';
import { StorageService } from 'src/app/_services/storage.service';
import { TeamService } from 'src/app/_services/team.service';

@Component({
  selector: 'app-squad-academy-list',
  templateUrl: './squad-academy-list.component.html',
  styleUrls: ['./squad-academy-list.component.scss']
})
export class SquadAcademyListComponent implements OnInit {
  public teams: any = [];
  private notifier: NotifierService;
  public academies: any = []
  public academy: any = {};
  constructor(private storageService: StorageService, notifier: NotifierService, private academyService: AcademyService, private teamService: TeamService, private store: Store, private router: Router,  public activatedRoute: ActivatedRoute){
    this.notifier = notifier;
  }

  ngOnInit(): void {
    let  id = this.activatedRoute.snapshot.params['id'];
    this.academyService.getAcademyById(id).subscribe((res:any) => {
      if(res){
        this.academy = res;
      } else {
        this.notifier.notify('error', 'Academy not found!');
      }
    })
    this.getTeamsByAcademy(id);
  }
  onTeamClick(team: any) {
    this.router.navigate([`/admin/academy/team/${team._id}`]);
  }
  getTeamsByAcademy(academyId:string) {
    this.teamService.getTeamsByAcademy(academyId).subscribe((res:any) => {
      if(res){
        this.teams = res
      }else {
        this.notifier.notify('error', 'Teams not found!');
      }
    })
  }
    redirectTo(){
      this.router.navigate(["/admin/academies"]);
    }

}
