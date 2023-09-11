import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import * as UserSelectors from "../../_store/selectors/users.selectors";
import { ColumnMode } from '@swimlane/ngx-datatable';
import { UserService } from 'src/app/_services/user.service';



@Component({
  selector: 'app-admin-data-table',
  templateUrl: './admin-data-table.component.html',
  styleUrls: ['./admin-data-table.component.scss']
})
export class AdminDataTableComponent implements OnInit {
  @ViewChild('myTable') table:any;
  @Output() delUser = new EventEmitter<string>();
  @Output() editUser = new EventEmitter<string>();
  options = {}
  @Input() users:any = [];
  columns:any = [{ prop: 'firstname' }, { name: 'lastname' }, { name: 'username' } , { name: 'email' }];
  loadingIndicator = true;
  reorderable = true;
  ColumnMode = ColumnMode;

  constructor(private store: Store, private userService: UserService) {

    }

    ngOnInit() {

    }

    getUsersFromStore () {
      this.store.select(UserSelectors.getUsers).subscribe(users => {
        this.users = users;
       });
    }

    edit(value: any) {
      this.editUser.emit(value);
    }

    delete(value: any) {
      this.delUser.emit(value);
    }
}
