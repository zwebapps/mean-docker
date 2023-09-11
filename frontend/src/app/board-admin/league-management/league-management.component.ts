import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as LeagueSelectors from "../../_store/selectors/leagues.selectors";
import { FormControl, FormGroup } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { AcademyService } from 'src/app/_services/academy.service';
import { StorageService } from 'src/app/_services/storage.service';
import * as LeagueActions from "../../_store/actions/leagues.actions";
// importing selectors
import * as AcademySelectors from "../../_store/selectors/academies.selectors";
import { Router } from '@angular/router';
import { UserService } from 'src/app/_services/user.service';
import { LeagueService } from 'src/app/_services/league.service';
import { loadAcademies } from 'src/app/_store/actions/academies.actions';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';

@Component({
  selector: 'app-league-management',
  templateUrl: './league-management.component.html',
  styleUrls: ['./league-management.component.scss']
})
export class LeagueManagementComponent implements OnInit {
  private notifier: NotifierService;
  leagues: any = []
  leagueForm = new FormGroup({
    leagueName: new FormControl('')
  });

  constructor( private storageService: StorageService, notifier: NotifierService, private academyService: AcademyService, private store: Store, private router: Router, private userService: UserService, private leagueService: LeagueService, private confirmationDialogService: ConfirmationDialogService) {
    this.notifier = notifier;
   }

  ngOnInit(): void {
    this.store.select(LeagueSelectors.getLeagues).subscribe(leagues => {
      if(leagues) {
        this.leagues = leagues;
      }
    })
  }

  getAgeFromName (leagueName:any) {
   let nameArray = leagueName.match(/(\d+)/)
   if(!nameArray){
    this.notifier.notify('error', 'League name should contain age limit!');
    return;
   }
   return nameArray.find((nm:any) => !isNaN(nm))
  }


  onSubmit() {
    if(!this.leagueForm.value.leagueName) {
      this.notifier.notify('error', 'League name not provided!');
      return;
    } else {
      const user = this.storageService.getUser();
      if(this.leagueForm.value.leagueName) {
        const leagueData = {
          "League Name": this.leagueForm.value.leagueName,
          "Age Limit": this.getAgeFromName(this.leagueForm.value.leagueName),
          "user": {
              "createdBy": user._id
          }
      }
        // check if academy exists
        this.leagueService.createLeague(leagueData).subscribe((res:any) => {
          if(res.message) {
            this.notifier.notify(res.type, res.message);
            return;
          } else {
            this.notifier.notify('success', 'League created successfully!');
            this.store.dispatch(LeagueActions.loadLeagues());
          }
        });
      }
    }
  }


  onDeleteLeague(leagueId:any) {
    this.openConfirmationDialog();
  }

  public openConfirmationDialog() {
    this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to ... ?')
    .then((confirmed) => console.log('User confirmed:', confirmed))
    .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

}
