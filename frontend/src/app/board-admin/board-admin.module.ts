import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserManagementComponent } from "./user-management/user-management.component";
import { LeagueManagementComponent } from "./league-management/league-management.component";
import { SquadManagementComponent } from "./squad-management/squad-management.component";
import { RouterModule, Routes } from "@angular/router";
import { BoardAdminComponent } from "./board-admin.component";
import { AuthGuard } from "../_helpers/auth.guard";
import { TeamManagementComponent } from "./team-management/team-management.component";
import { AdminDashboardComponent } from "./admin-dashboard/admin-dashboard.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { AcademyDetailComponent } from "./academy-detail/academy-detail.component";
import { AcademyLeagueSelectionComponent } from "./academy-league-selection/academy-league-selection.component";
import { SquadAcademyListComponent } from "./squad-academy-list/squad-academy-list.component";
import { SquadListComponent } from "./squad-list/squad-list.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NotifierModule, NotifierOptions } from "angular-notifier";
import { ConfirmationDialogService } from "../_services/confirmation-dialog.service";
// Import the library
import { NgxImageZoomModule } from "ngx-image-zoom";
import { AdminNotificationsComponent } from "./admin-notifications/admin-notifications.component";
import { AngularEditorModule } from "@kolkov/angular-editor";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { NgbModule, NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { AdminSharedModule } from "../admin-shared/admin-shared.module";
import { DashboardModule } from "../dashboard/dashboard.module";
import { AdminTopFiltersComponent } from "./admin-top-filters/admin-top-filters.component";
import { AdminCompetitionComponent } from "../admin-shared/admin-competition/admin-competition.component";
import { ComponentsModule } from "../component/component.module";
import { AdminPlayersComponent } from "./admin-players/admin-players.component";

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

const adminRoutes: Routes = [
  {
    path: "",
    canActivate: [AuthGuard],
    component: BoardAdminComponent,
    children: [
      {
        path: "dashboard",
        component: AdminDashboardComponent
      },
      {
        path: "competitions",
        component: AdminCompetitionComponent
      },
      // {
      //   path: "competitions",
      //   loadChildren: () => import("../component/component.module").then((m) => m.ComponentsModule)
      // },
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
        path: "players",
        component: AdminPlayersComponent
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
  declarations: [AdminPlayersComponent],
  imports: [
    NgbModule,
    AdminSharedModule,
    CommonModule,
    NgxImageZoomModule,
    NgbNavModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    FormsModule,
    AngularEditorModule,
    DashboardModule,
    ComponentsModule,
    NgMultiSelectDropDownModule.forRoot(),
    NotifierModule.withConfig(customNotifierOptions),
    RouterModule.forChild(adminRoutes)
  ],
  providers: [ConfirmationDialogService],
  exports: [RouterModule]
})
export class BoardAdminModule {}
