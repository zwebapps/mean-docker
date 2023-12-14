import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../_helpers/auth.guard";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NotifierModule, NotifierOptions } from "angular-notifier";
import { ConfirmationDialogService } from "../_services/confirmation-dialog.service";
// Import the library
import { NgxImageZoomModule } from "ngx-image-zoom";
import { AngularEditorModule } from "@kolkov/angular-editor";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { NgbModule, NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { AdminSharedModule } from "../admin-shared/admin-shared.module";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { AnalyticsComponent } from "../analytics/analytics.component";
// import { AcademyDetailComponent } from "../board-admin/academy-detail/academy-detail.component";
// import { AcademyLeagueSelectionComponent } from "../board-admin/academy-league-selection/academy-league-selection.component";
// import { AdminNotificationsComponent } from "../board-admin/admin-notifications/admin-notifications.component";
// import { LeagueManagementComponent } from "../board-admin/league-management/league-management.component";
// import { SquadAcademyListComponent } from "../board-admin/squad-academy-list/squad-academy-list.component";
// import { SquadListComponent } from "../board-admin/squad-list/squad-list.component";
// import { SquadManagementComponent } from "../board-admin/squad-management/squad-management.component";
// import { TeamManagementComponent } from "../board-admin/team-management/team-management.component";
// import { UserManagementComponent } from "../board-admin/user-management/user-management.component";
import { SuperAdminComponent } from "./super-admin/super-admin.component";
import { CompititionComponent } from "./compitition/compitition.component";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { DashboardModule } from "../dashboard/dashboard.module";
import { NgxChartsModule } from "@swimlane/ngx-charts";

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

const superAdminRoutes: Routes = [
  {
    path: "dashboard",
    canActivate: [AuthGuard],
    component: DashboardComponent
    // children: [
    // {
    //   path: "compititions",
    //   component: SuperAdminComponent
    // }
    // {
    //   path: "dashboard",
    //   component: AnalyticsComponent
    // }
    // {
    //   path: ":shortcode/users",
    //   component: UserManagementComponent
    // },
    // {
    //   path: ":shortcode/leagues",
    //   component: LeagueManagementComponent
    // },
    // {
    //   path: ":shortcode/academies/academy/:id",
    //   component: AcademyDetailComponent
    // },
    // {
    //   path: ":shortcode/academy/team/:id", // select leagues for team
    //   component: AcademyLeagueSelectionComponent
    // },
    // {
    //   path: ":shortcode/squads",
    //   component: SquadManagementComponent
    // },
    // {
    //   path: ":shortcode/squads/academy/:id",
    //   component: SquadAcademyListComponent
    // },
    // {
    //   path: ":shortcode/squads/squadlist/:id",
    //   component: SquadListComponent
    // },
    // {
    //   path: ":shortcode/academies",
    //   component: TeamManagementComponent
    // },
    // {
    //   path: ":shortcode/notifications",
    //   component: AdminNotificationsComponent
    // }
    // ]
  },
  {
    path: "compititions",
    canActivate: [AuthGuard],
    component: SuperAdminComponent
  }
];

@NgModule({
  declarations: [SuperAdminComponent, CompititionComponent, AnalyticsComponent],
  imports: [
    NgxChartsModule,
    NgxDatatableModule,
    CommonModule,
    NgbModule,
    AdminSharedModule,
    NgxImageZoomModule,
    NgbNavModule,
    ReactiveFormsModule,
    FormsModule,
    AngularEditorModule,
    NgMultiSelectDropDownModule.forRoot(),
    NotifierModule.withConfig(customNotifierOptions),
    RouterModule.forChild(superAdminRoutes)
  ],
  providers: [ConfirmationDialogService],
  exports: [RouterModule]
})
export class SuperAdminModule {}
