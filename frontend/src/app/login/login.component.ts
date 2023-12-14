import { AfterViewInit, Component, OnInit } from "@angular/core";
import { AuthService } from "../_services/auth.service";
import { StorageService } from "../_services/storage.service";
import { Router } from "@angular/router";
import { NotifierService } from "angular-notifier";
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit, AfterViewInit {
  notifier: NotifierService;
  form: any = {
    username: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = "";
  roles: string[] = [];

  constructor(
    private ngxService: NgxUiLoaderService,
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    notifier: NotifierService
  ) {
    this.notifier = notifier;
  }

  ngOnInit(): void {
    this.redirectPage();
  }
  ngAfterViewInit(): void {
    this.redirectPage();
  }

  onSubmit(): void {
    const { username, password } = this.form;
    try {
      this.ngxService.start();
      this.authService.login(username, password).subscribe({
        next: (data) => {
          this.ngxService.stop();
          this.storageService.setSession(data.token);
          // delete token from data
          this.storageService.saveUser({
            email: data.email,
            id: data.id,
            roles: data.roles,
            username: data.username,
            compitition: data.compitition,
            shortcode: data.shortcode
          });

          this.isLoginFailed = false;
          this.isLoggedIn = true;
          this.roles = this.storageService.getUser().roles;
          // this.reloadPage();
          this.redirectPage();
        },
        error: (err) => {
          this.ngxService.stop();
          this.notifier.notify("error", "Login failed");
        },
        complete: () => {
          this.ngxService.stop();
          this.notifier.notify("error", "login failed");
        }
      });
    } catch (err: any) {
      this.ngxService.stop();
      this.notifier.notify("error", "login failed");
    }
  }

  reloadPage(): void {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  }

  userChoice(choice: any): void {
    this.router.navigateByUrl(`/${choice}`);
  }

  redirectPage(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      const { shortcode } = this.storageService.getUser();
      this.roles = this.storageService.getUser().roles;
      if (this.roles.includes("ROLE_SUPERADMIN")) {
        this.router.navigateByUrl("/superadmin/dashboard");
      } else if (this.roles.includes("ROLE_ADMIN")) {
        this.router.navigateByUrl(`${shortcode}/admin/dashboard`);
      } else if (this.roles.includes("ROLE_COACH")) {
        this.router.navigateByUrl(`${shortcode}/coach/dashboard`);
      } else if (this.roles.includes("ROLE_REFEREE")) {
        this.router.navigateByUrl(`${shortcode}/referee/dashboard`);
      } else {
        this.router.navigateByUrl("/404");
      }
    } else {
      this.isLoggedIn = false;
      this.router.navigate(["login"]);
    }
  }
  ngOnDestroy(): void {
    this.reloadPage();
  }
}
