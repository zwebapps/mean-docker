import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CommonModule, LocationStrategy, PathLocationStrategy } from "@angular/common";
import { NgModule, isDevMode } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Routes, RouterModule } from "@angular/router";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { FullComponent } from "./layouts/full/full.component";
import { NavigationComponent } from "./shared/header/navigation.component";
import { SidebarComponent } from "./shared/sidebar/sidebar.component";
import { AppRoutingModule, Approutes } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { SpinnerComponent } from "./shared/spinner.component";
import { LoginComponent } from "./login/login.component";
import { BoardAdminComponent } from "./board-admin/board-admin.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { BoardUserComponent } from "./board-user/board-user.component";
import { HomeComponent } from "./home/home.component";
import { ProfileComponent } from "./profile/profile.component";
import { RegisterComponent } from "./register/register.component";
import { AdminComponent } from "./admin/admin.component";
import { AuthGuardService } from "./guards/auth-guard.service";
import { StoreModule } from "@ngrx/store";
import { reducers, metaReducers } from "./_store/reducers";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { CollectionsComponentComponent } from "./collections-component/collections-component.component";
import { EffectsModule } from "@ngrx/effects";
import { UsersEffects } from "./_store/effects/users.effects";
import { AcademiesEffects } from "./_store/effects/academies.effects";
import { NotificationsEffects } from "./_store/effects/notifications.effects";
import { TeamsEffects } from "./_store/effects/teams.effects";
import { LeaguesEffects } from "./_store/effects/leagues.effects";
import { FixuresEffects } from "./_store/effects/fixures.effects";
import { PlayersEffects } from "./_store/effects/players.effects";
import { AuthInterceptor } from "./_helpers/authconfig.interceptor";
import { CoachComponent } from "./coach/coach.component";
import { BoardAdminModule } from "./board-admin/board-admin.module";
import { CoachModule } from "./coach/coach.module";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { NotifierModule, NotifierOptions } from "angular-notifier";
// Import the library
import { NgxImageZoomModule } from "ngx-image-zoom";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { provideClientHydration } from "@angular/platform-browser";
import { NgxUiLoaderModule, NgxUiLoaderHttpModule, NgxUiLoaderConfig, SPINNER, POSITION, PB_DIRECTION } from "ngx-ui-loader";
import { ErrorPageComponent } from "./error-page/error-page.component";

const environment = {
  production: false
};

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: "red",
  bgsPosition: POSITION.bottomCenter,
  bgsSize: 40,
  bgsType: SPINNER.rectangleBounce, // background spinner type
  fgsType: SPINNER.chasingDots, // foreground spinner type
  pbDirection: PB_DIRECTION.leftToRight, // progress bar direction
  pbThickness: 5 // progress bar thickness
};
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
    ErrorPageComponent,
    AppComponent,
    SpinnerComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    BoardAdminComponent,
    CoachComponent,
    BoardUserComponent,
    AdminComponent,
    CollectionsComponentComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: "serverApp" }),
    NgxUiLoaderHttpModule.forRoot({ showForeground: true }),
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxImageZoomModule,
    NgxDatatableModule,
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    SweetAlert2Module.forRoot(),
    NotifierModule.withConfig(customNotifierOptions),
    NotifierModule,
    RouterModule.forRoot(Approutes, { useHash: false }),
    FullComponent,
    NavigationComponent,
    SidebarComponent,
    BoardAdminModule,
    CoachModule,
    FontAwesomeModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([
      UsersEffects,
      AcademiesEffects,
      NotificationsEffects,
      TeamsEffects,
      LeaguesEffects,
      FixuresEffects,
      PlayersEffects
    ])
  ],
  providers: [
    provideClientHydration(),
    AuthGuardService,
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
