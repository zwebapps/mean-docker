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

import { SuperAdminRoutingModule } from "./super-admin-routing.module";
import { SuperAdminComponent } from "./super-admin/super-admin.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { AcademyDetailComponent } from "../board-admin/academy-detail/academy-detail.component";
import { AcademyLeagueSelectionComponent } from "../board-admin/academy-league-selection/academy-league-selection.component";
import { AdminDashboardComponent } from "../board-admin/admin-dashboard/admin-dashboard.component";
import { AdminNotificationsComponent } from "../board-admin/admin-notifications/admin-notifications.component";
import { LeagueManagementComponent } from "../board-admin/league-management/league-management.component";
import { SquadAcademyListComponent } from "../board-admin/squad-academy-list/squad-academy-list.component";
import { SquadListComponent } from "../board-admin/squad-list/squad-list.component";
import { SquadManagementComponent } from "../board-admin/squad-management/squad-management.component";
import { TeamManagementComponent } from "../board-admin/team-management/team-management.component";
import { UserManagementComponent } from "../board-admin/user-management/user-management.component";
import { AdminSharedModule } from "../admin-shared/admin-shared.module";
import { AnalyticsComponent } from "../analytics/analytics.component";
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

const superAdminRoutes: Routes = [
  {
    path: "",
    canActivate: [AuthGuard],
    component: SuperAdminComponent,
    children: [
      {
        path: "analytics",
        component: AnalyticsComponent
      },
      {
        path: "dashboard",
        component: SuperAdminComponent
      },
      {
        path: "users",
        component: UserManagementComponent
      },
      {
        path: "leagues",
        component: LeagueManagementComponent
      },
      {
        path: "academies/academy/:id",
        component: AcademyDetailComponent
      },
      {
        path: "academy/team/:id", // select leagues for team
        component: AcademyLeagueSelectionComponent
      },
      {
        path: "squads",
        component: SquadManagementComponent
      },
      {
        path: "squads/academy/:id",
        component: SquadAcademyListComponent
      },
      {
        path: "squads/squadlist/:id",
        component: SquadListComponent
      },
      {
        path: "academies",
        component: TeamManagementComponent
      },
      {
        path: "notifications",
        component: AdminNotificationsComponent
      }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgxImageZoomModule,
    NgbNavModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    FormsModule,
    AngularEditorModule,
    AdminSharedModule,
    NgbModule,
    NotifierModule.withConfig(customNotifierOptions),
    RouterModule.forChild(superAdminRoutes),
    NgMultiSelectDropDownModule.forRoot(),
    SuperAdminRoutingModule
  ],
  providers: [ConfirmationDialogService],
  exports: [RouterModule]
})
// @NgModule({
//   declarations: [],
//   imports: [CommonModule, SuperAdminRoutingModule]
// })
export class SuperAdminModule {}
