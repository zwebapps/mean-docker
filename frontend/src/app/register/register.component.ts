import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { StorageService } from '../_services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form: any = {
    firstname: null,
    lastname: null,
    username: null,
    email: null,
    password: null
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  isLoggedIn = false;

  constructor(private authService: AuthService, private storageService: StorageService, private router: Router) { }

  ngOnInit () : void {
    this.isLoggedIn = this.storageService.isLoggedIn();

    if (this.storageService.isLoggedIn()) {
      this.router.navigate(["dashboard"]);
    }
  }

  onSubmit(): void {
    const { firstname, lastname, username, email, password } = this.form;

    this.authService.register(firstname, lastname, username, email, password).subscribe({
      next: data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }
}
