import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const AUTH_API = `${environment.apiURL}/api/auth/`;


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // headers = new HttpHeaders({
  //                         'Content-Type': 'text/plain'
  //                       });

  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      username,
      password,
      },
      { headers: this.headers }
    );

  }

  register(firstname: string, lastname:string, username: string, email: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signup',
      {
        firstname,
        lastname,
        username,
        email,
        password,
      },
      { headers: this.headers }
    );
  }

  logout(): Observable<any> {
    return this.http.post(AUTH_API + 'signout', { }, { headers: this.headers });
  }


}
