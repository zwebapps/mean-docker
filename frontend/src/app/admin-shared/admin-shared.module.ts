import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AcademyDetailComponent } from "../board-admin/academy-detail/academy-detail.component";
import { AcademyLeagueSelectionComponent } from "../board-admin/academy-league-selection/academy-league-selection.component";
import { AcademyManagementComponent } from "../board-admin/academy-management/academy-management.component";
import { AdminDashboardComponent } from "../board-admin/admin-dashboard/admin-dashboard.component";
import { AdminDataTableComponent } from "../board-admin/admin-data-table/admin-data-table.component";
import { AdminNotificationsComponent } from "../board-admin/admin-notifications/admin-notifications.component";
import { AdminSquadListComponent } from "../board-admin/admin-squad-list/admin-squad-list.component";
import { ConfirmationModalComponent } from "../board-admin/confirmation-modal/confirmation-modal.component";
import { LeagueManagementComponent } from "../board-admin/league-management/league-management.component";
import { SquadAcademyListComponent } from "../board-admin/squad-academy-list/squad-academy-list.component";
import { SquadListComponent } from "../board-admin/squad-list/squad-list.component";
import { SquadManagementComponent } from "../board-admin/squad-management/squad-management.component";
import { TeamManagementComponent } from "../board-admin/team-management/team-management.component";
import { UserManagementComponent } from "../board-admin/user-management/user-management.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { AngularEditorModule } from "@kolkov/angular-editor";
import { NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { NgxImageZoomModule } from "ngx-image-zoom";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { NotifierModule, NotifierOptions } from "angular-notifier";

/**
 * Custom angular notifier options
 */
const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: "right",
      distance: 12
    },
    vertical: {
      position: "bottom",
      distance: 12,
      gap: 10
    }
  },
  theme: "material",
  behaviour: {
    autoHide: 5000,
    onClick: "hide",
    onMouseover: "pauseAutoHide",
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: "slide",
      speed: 300,
      easing: "ease"
    },
    hide: {
      preset: "fade",
      speed: 300,
      easing: "ease",
      offset: 50
    },
    shift: {
      speed: 300,
      easing: "ease"
    },
    overlap: 150
  }
};

@NgModule({
  declarations: [
    UserManagementComponent,
    LeagueManagementComponent,
    SquadManagementComponent,
    TeamManagementComponent,
    AcademyManagementComponent,
    AdminDashboardComponent,
    AdminDataTableComponent,
    AcademyDetailComponent,
    AcademyLeagueSelectionComponent,
    SquadAcademyListComponent,
    SquadListComponent,
    AdminSquadListComponent,
    ConfirmationModalComponent,
    AdminNotificationsComponent
  ],
  imports: [
    CommonModule,
    NgxImageZoomModule,
    NgbNavModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    FormsModule,
    AngularEditorModule,
    NgMultiSelectDropDownModule.forRoot(),
    NotifierModule.withConfig(customNotifierOptions)
  ],
  exports: [
    UserManagementComponent,
    LeagueManagementComponent,
    SquadManagementComponent,
    TeamManagementComponent,
    AcademyManagementComponent,
    AdminDashboardComponent,
    AdminDataTableComponent,
    AcademyDetailComponent,
    AcademyLeagueSelectionComponent,
    SquadAcademyListComponent,
    SquadListComponent,
    AdminSquadListComponent,
    ConfirmationModalComponent,
    AdminNotificationsComponent
  ]
})
export class AdminSharedModule {}
