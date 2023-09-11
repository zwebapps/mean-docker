import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

const USER_KEY = "auth-user";
const TOKEN = "token";

@Injectable({
  providedIn: "root"
})
export class StorageService {
  constructor(private http: HttpClient, public router: Router) {}

  clean(): void {
    window.sessionStorage.clear();
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return null;
  }

  public isLoggedIn(): boolean {
    let authToken = window.sessionStorage.getItem(TOKEN);
    return authToken !== null ? true : false;
  }
  public getToken(): any {
    return window.sessionStorage.getItem(TOKEN);
  }

  public setSession(token: any) {
    window.sessionStorage.setItem(TOKEN, token);
  }

  public doLogout() {
    let removeToken = window.sessionStorage.removeItem(TOKEN);
    if (removeToken == null) {
      this.router.navigate(["login"]);
    }
  }
}
