import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

// const API_URL = 'http://localhost:8080';
const API_URL = environment.apiURL;

@Injectable({
  providedIn: "root"
})
export class FixtureService {
  private headers = new HttpHeaders().set("Content-Type", "application/json");

  constructor(private http: HttpClient) {}

  loadFixtures(): Observable<any> {
    return this.http.get(`${API_URL}/fixture/all`, { headers: this.headers });
  }
  loadFixturesByCompitition(compitition: string): Observable<any> {
    debugger;
    return this.http.get(`${API_URL}/fixture/forcompitition/${compitition}`, { headers: this.headers });
  }
  createFixture(fixture: any): Observable<any> {
    return this.http.post(`${API_URL}/fixture/create`, fixture, { headers: this.headers });
  }
  deleteFixture(id: any): Observable<any> {
    return this.http.post(`${API_URL}/fixture/delete/${id}`, { headers: this.headers });
  }
}
