import { Component, OnInit } from '@angular/core';
import * as AcademyActions from "../../_store/actions/academies.actions";
// importing selectors
import * as AcademySelectors from "../../_store/selectors/academies.selectors";
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-academy-management',
  templateUrl: './academy-management.component.html',
  styleUrls: ['./academy-management.component.scss']
})
export class AcademyManagementComponent implements OnInit {
  public academies: any = []
  constructor(private store: Store) {

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
