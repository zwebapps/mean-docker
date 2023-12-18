import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RefereeComponent } from "./referee.component";
import { GameManagementComponent } from "./game-management/game-management.component";
import { RefereeDashboardComponent } from "./referee-dashboard/referee-dashboard.component";
import { RouterModule, Routes } from "@angular/router";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { FixtureListingComponent } from "./fixture-listing/fixture-listing.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { RefereeSquadListingComponent } from "./referee-squad-listing/referee-squad-listing.component";
import { RefereeTeamSquadComponent } from "./referee-team-squad/referee-team-squad.component";
import { FixtureTeamDetailsComponent } from "./fixture-team-details/fixture-team-details.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NotifierModule, NotifierOptions } from "angular-notifier";
import { NgxImageMagnifierModule } from "ngx-image-magnifier";
// Import the library
import { NgxImageZoomModule } from "ngx-image-zoom";

const refereeRoutes: Routes = [
  {
    path: "",
    component: RefereeComponent,
    // pathMatch: 'full',
    children: [
      {
        path: "dashboard",
        component: RefereeDashboardComponent
      },
      {
        path: "mangegames",
        component: GameManagementComponent
      }
    ]
  }
];

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
    RefereeComponent,
    GameManagementComponent,
    RefereeDashboardComponent,
    FixtureListingComponent,
    RefereeSquadListingComponent,
    RefereeTeamSquadComponent,
    FixtureTeamDetailsComponent
  ],
  imports: [
    FormsModule,
    NgxImageZoomModule,
    CommonModule,
    NgbDropdownModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    NotifierModule.withConfig(customNotifierOptions),
    RouterModule.forChild(refereeRoutes)
  ]
})
export class RefereeModule {}
