import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { StorageService } from "./_services/storage.service";
import { AuthService } from "./_services/auth.service";
import { EventBusService } from "./_shared/event-bus.service";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { environment } from "./../environments/environment";
import { NgxUiLoaderService } from "ngx-ui-loader";

// importing actions
import * as UserActions from "./_store/actions/users.actions";
import * as TeamActions from "./_store/actions/teams.actions";
import * as PlayerActions from "./_store/actions/players.actions";
import * as LeagueActions from "./_store/actions/leagues.actions";
import * as FixureActions from "./_store/actions/fixures.actions";
import * as AcademyActions from "./_store/actions/academies.actions";
import * as NotificationActions from "./_store/actions/notification.actions";

// importing selectors
import * as UserSelectors from "./_store/selectors/users.selectors";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "app";
  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;

  eventBusSub?: Subscription;

  // user from store
  users$: any;

  constructor(
    private ngxService: NgxUiLoaderService,
    private storageService: StorageService,
    private authService: AuthService,
    private eventBusService: EventBusService,
    private router: Router,
    private store: Store
  ) {}

  ngOnInit(): void {
    console.log(environment);
    this.isLoggedIn = this.storageService.isLoggedIn();

    if (this.isLoggedIn) {
      const user = this.storageService.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes("ROLE_ADMIN");
      this.showModeratorBoard = this.roles.includes("ROLE_MODERATOR");
      this.username = user.username;

      this.ngxService.start();
      // gettinga all listings for store
      if (this.showAdminBoard) {
        this.store.dispatch(UserActions.loadUsers());
      }

      this.store.dispatch(TeamActions.loadTeams());
      this.store.dispatch(LeagueActions.loadLeagues());
      this.store.dispatch(FixureActions.loadFixtures());
      this.store.dispatch(AcademyActions.loadAcademies());
      this.store.dispatch(PlayerActions.loadPlayers());
      this.store.dispatch(NotificationActions.loadNotifications());
      this.ngxService.stop();
    }

    this.eventBusSub = this.eventBusService.on("logout", () => {
      this.logout();
    });

    // select to get user from store
    this.users$ = this.store.select(UserSelectors.getUsers);
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: (res) => {
        console.log(res);
        this.storageService.clean();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
