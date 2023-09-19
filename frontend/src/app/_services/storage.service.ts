import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";

import { PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";

const USER_KEY = "auth-user";
const TOKEN = "token";

@Injectable({
  providedIn: "root"
})
export class StorageService {
  constructor(@Inject(PLATFORM_ID) private platformId: any, private http: HttpClient, public router: Router) {}

  clean(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.sessionStorage.clear();
    }
  }

  public saveUser(user: any): void {
    if (isPlatformBrowser(this.platformId)) {
      window.sessionStorage.removeItem(USER_KEY);
      window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }

  public getUser(): any {
    if (isPlatformBrowser(this.platformId)) {
      const user = window.sessionStorage.getItem(USER_KEY);
      if (user) {
        return JSON.parse(user);
      }
    }
    return null;
  }

  public isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      let authToken = window.sessionStorage.getItem(TOKEN);
      return authToken !== null ? true : false;
    } else {
      return false;
    }
  }
  public getToken(): any {
    if (isPlatformBrowser(this.platformId)) {
      return window.sessionStorage.getItem(TOKEN);
    }
  }

  public setSession(token: any) {
    if (isPlatformBrowser(this.platformId)) {
      window.sessionStorage.setItem(TOKEN, token);
    }
  }

  public doLogout() {
    if (isPlatformBrowser(this.platformId)) {
      let removeToken = window.sessionStorage.removeItem(TOKEN);
      if (removeToken == null) {
        this.router.navigate(["login"]);
      }
    }
  }
}
