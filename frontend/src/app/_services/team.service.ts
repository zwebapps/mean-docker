import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "../../environments/environment";

// const API_URL = 'http://localhost:8080';
const API_URL = environment.apiURL;

@Injectable({
  providedIn: "root"
})
export class TeamService {
  private headers = new HttpHeaders().set("Content-Type", "application/json");

  constructor(private http: HttpClient) {}

  loadTeams(): Observable<any> {
    return this.http.get(`${API_URL}/team/all`, { headers: this.headers });
  }
  getTeamsByAcademy(id: string): Observable<any> {
    return this.http.get(`${API_URL}/team/foracademy/${id}`, { headers: this.headers });
  }

  loadTeamsByCompitition(compitition: string): Observable<any> {
    return this.http.get(`${API_URL}/team/forcompitition/${compitition}`, { headers: this.headers });
  }
  loadTeamsByShortcode(shortcode: string): Observable<any> {
    return this.http.get(`${API_URL}/team/forshortcode/${shortcode}`, { headers: this.headers });
  }
  createTeam(teamData: any): Observable<any> {
    return this.http.post(`${API_URL}/team/create`, teamData, { headers: this.headers });
  }
  getTeamById(id: string): Observable<any> {
    return this.http.get(`${API_URL}/team/${id}`, { headers: this.headers });
  }
  updateTeam(id: string, teamData: any): Observable<any> {
    return this.http.post(`${API_URL}/team/update/${id}`, teamData, { headers: this.headers });
  }

  deleteTeam(id: string): Observable<any> {
    return this.http.post(`${API_URL}/team/delete/${id}`, { headers: this.headers });
  }
}
