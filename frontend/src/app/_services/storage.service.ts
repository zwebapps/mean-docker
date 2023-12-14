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
  constructor(private http: HttpClient, public router: Router) {}

  clean(): void {
    if (typeof window !== "undefined") {
      window.sessionStorage.clear();
    }
  }

  public saveUser(user: any): void {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(USER_KEY);
      window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }

  public getUser(): any {
    if (typeof window !== "undefined") {
      const user = window.sessionStorage.getItem(USER_KEY);
      if (user) {
        return JSON.parse(user);
      }
    }
    return null;
  }

  public isLoggedIn(): boolean {
    if (typeof window !== "undefined") {
      let authToken = window.sessionStorage.getItem(TOKEN);
      return authToken !== null ? true : false;
    } else {
      return false;
    }
  }
  public getToken(): any {
    if (typeof window !== "undefined") {
      return window.sessionStorage.getItem(TOKEN);
    }
  }

  public setSession(token: any) {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(TOKEN, token);
    }
  }

  public doLogout() {
    if (typeof window !== "undefined") {
      let removeToken = window.sessionStorage.removeItem(TOKEN);
      if (removeToken == null) {
        this.router.navigate(["login"]);
      }
    }
  }
}
