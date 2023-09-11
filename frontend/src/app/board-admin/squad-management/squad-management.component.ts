import { Component } from '@angular/core';
import * as AcademyActions from "../../_store/actions/academies.actions";
// importing selectors
import * as AcademySelectors from "../../_store/selectors/academies.selectors";
import { Store } from '@ngrx/store';
import { NotifierService } from 'angular-notifier';
import { StorageService } from 'src/app/_services/storage.service';
import { AcademyService } from 'src/app/_services/academy.service';
import { TeamService } from 'src/app/_services/team.service';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'app-squad-management',
  templateUrl: './squad-management.component.html',
  styleUrls: ['./squad-management.component.scss']
})
export class SquadManagementComponent {
  private notifier: NotifierService;
  academy: any = {};
  teams: any = [];
  public academies: any = []
  constructor(private storageService: StorageService, notifier: NotifierService, private academyService: AcademyService, private teamService: TeamService, private store: Store, private router: Router,  public activatedRoute: ActivatedRoute){
    this.notifier = notifier;
  }

  ngOnInit(): void {
    this.getAcademiesFromStore();
  }
  getAcademiesFromStore () {
    this.store.select(AcademySelectors.getAcademies).subscribe(academy => {
      this.academies = academy;
      });
    }
}
