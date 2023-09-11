import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { AcademyService } from 'src/app/_services/academy.service';
import { StorageService } from 'src/app/_services/storage.service';
import * as AcademyActions from "../../_store/actions/academies.actions";
// importing selectors
import * as AcademySelectors from "../../_store/selectors/academies.selectors";
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-team-management',
  templateUrl: './team-management.component.html',
  styleUrls: ['./team-management.component.scss']
})
export class TeamManagementComponent implements OnInit {
  private notifier: NotifierService;
  public academies: any = []

  academyForm = new FormGroup({
    academyName: new FormControl('')
  });

  constructor( private storageService: StorageService, notifier: NotifierService, private academyService: AcademyService, private store: Store, private router: Router, private userService: UserService) {
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


  onSubmit() {
    if(!this.academyForm.value.academyName) {
      this.notifier.notify('error', 'Academy name not provided!');
      return;
    } else {
      const user = this.storageService.getUser();
      if(this.academyForm.value.academyName) {
        const academyData =  {
          "Academy Name": this.academyForm.value.academyName,
          "Academy User Name": this.makeAcademyUserName(this.academyForm.value.academyName),
          "Email": `${this.makeAcademyUserName(this.academyForm.value.academyName)}@dummy.com`,
          "Password": `Password@${this.makeAcademyUserName(this.academyForm.value.academyName)}`,
          "user": {
              "createdBy": user.id
          }
        }
        const userData = {
          firstname: this.makeAcademyUserName(this.academyForm.value.academyName),
          lastname: this.makeAcademyUserName(this.academyForm.value.academyName),
          username: this.makeAcademyUserName(this.academyForm.value.academyName),
          email: `${this.makeAcademyUserName(this.academyForm.value.academyName)}@dummy.com`,
          password: `Password@${this.makeAcademyUserName(this.academyForm.value.academyName)}`,
          role : 'coach'
        }
        // check if academy exists
        this.academyService.getAcademyByName({name: this.academyForm.value.academyName}).subscribe((res:any) => {
          if(!res.message) {
            this.notifier.notify('error', 'Academy Name already exists!');
            return;
          }else {
            this.userService.createUser(userData).subscribe((user:any) => {
              if(user) {
                // add owner for new academy.
                academyData.user = {
                  "createdBy": user._id
                }
                this.academyService.createAcademy(academyData).subscribe((res:any) => {
                  if(res._id) {
                    this.notifier.notify('success', 'Academy created successfully!');
                    this.store.dispatch(AcademyActions.loadAcademies());
                  }
                })
              }
            })
          }
        })
      }
    }
  }

  makeAcademyUserName(academyName:any) {
    if(academyName) {
      return academyName.replace(/\s/g,'').toLowerCase();
    }
  }

  academyDetails(id:string) {
    this.router.navigate([`/academies/academy/${id}`]);
  }
  redirectTo(){
    this.router.navigate(["/admin/academies/academy"]);
  }
}
