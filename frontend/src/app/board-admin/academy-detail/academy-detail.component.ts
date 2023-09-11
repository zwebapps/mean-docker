import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { AcademyService } from 'src/app/_services/academy.service';
import { StorageService } from 'src/app/_services/storage.service';
import * as AcademyActions from "../../_store/actions/academies.actions";
// importing selectors
import * as AcademySelectors from "../../_store/selectors/academies.selectors";
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { TeamService } from 'src/app/_services/team.service';

@Component({
  selector: 'app-academy-detail',
  templateUrl: './academy-detail.component.html',
  styleUrls: ['./academy-detail.component.scss']
})
export class AcademyDetailComponent implements OnInit {
  private notifier: NotifierService;
  academy: any = {};
  teams: any = [];

  teamForm = new FormGroup({
    teamName: new FormControl('')
  });
  constructor(private storageService: StorageService, notifier: NotifierService, private academyService: AcademyService, private teamService: TeamService, private store: Store, private router: Router,  public activatedRoute: ActivatedRoute) {
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
  onSubmit() {
    if(!this.teamForm.value.teamName) {
      this.notifier.notify('error', 'Academy name not provided!');
      return;
    } else {
      const user = this.storageService.getUser();
      if(this.teamForm.value.teamName) {
        const teamData =  {
          "Team Name": this.teamForm.value.teamName,
          "Academy Id": this.academy._id,
          "leagues": [],
          "user": {
              "createdBy": user.id
          }
        }
        this.teamService.createTeam(teamData).subscribe((res:any) => {
          this.getTeamsByAcademy( this.academy._id);
          if(res._id){
            this.notifier.notify('success', 'Team created successfully!');
            this.store.dispatch(AcademyActions.loadAcademies());
          } else {
            this.notifier.notify('error', res.message);
          }
        })
      }
    }
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
  onTeamClick(team: any) {
    this.router.navigate([`/admin/academy/team/${team._id}`]);
  }
  redirectTo(){
    this.router.navigate(["/admin/academies"]);
  }
}
