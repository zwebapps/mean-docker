import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "../../environments/environment";

// const API_URL = 'http://localhost:8080';
const API_URL = environment.apiURL;

@Injectable({
  providedIn: "root"
})
export class LeagueService {
  private headers = new HttpHeaders().set("Content-Type", "application/json");

  constructor(private http: HttpClient) {}

  loadLeagues(): Observable<any> {
    return this.http.get(`${API_URL}/league/all`, { headers: this.headers });
  }
  loadLeaguesByCompetition(competition: string): Observable<any> {
    return this.http.get(`${API_URL}/league/forcompetition/${competition}`, { headers: this.headers });
  }
  loadLeaguesByShortcode(shortcode: string): Observable<any> {
    return this.http.get(`${API_URL}/league/forshortcode/${shortcode}`, { headers: this.headers });
  }
  createLeague(league: any): Observable<any> {
    return this.http.post(`${API_URL}/league/create`, league, { headers: this.headers });
  }
  deleteLeague(league: any): Observable<any> {
    return this.http.post(`${API_URL}/league/delete/${league}`, { headers: this.headers });
  }
  updateLeague(id: any, league: any): Observable<any> {
    return this.http.post(`${API_URL}/league/update/${id}`, league, { headers: this.headers });
  }
}
