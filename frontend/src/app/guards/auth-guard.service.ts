import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { StorageService } from '../_services/storage.service';
@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(public storage: StorageService, public router: Router) {}
  canActivate(): boolean {
    if (!this.storage.isLoggedIn()) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
