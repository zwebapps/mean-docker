import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

const API_URL = environment.apiURL;

@Injectable({
  providedIn: "root"
})
export class CompetitionService {
  private headers = new HttpHeaders().set("Content-Type", "application/json");

  constructor(private http: HttpClient) {}

  getCompetitions(): Observable<any> {
    return this.http.get(`${API_URL}/competition/all`, { headers: this.headers });
  }
  createCompetition(competition: any): Observable<any> {
    return this.http.post(`${API_URL}/competition/create`, competition, { headers: this.headers });
  }
  getCompetitionById(id: any): Observable<any> {
    return this.http.get(`${API_URL}/competition/${id}`, { headers: this.headers });
  }
  getCompetitionByName(competition: any): Observable<any> {
    return this.http.get(`${API_URL}/competition/competitionbyname/${competition}`, { headers: this.headers });
  }

  getCompetitionByShortCode(competition: any): Observable<any> {
    return this.http.get(`${API_URL}/competition/shortcode/${competition}`, { headers: this.headers });
  }

  updateCompetition(id: any, competition: any): Observable<any> {
    return this.http.post(`${API_URL}/competition/update/${id}`, competition, { headers: this.headers });
  }
  deleteCompetition(id: any): Observable<any> {
    return this.http.post(`${API_URL}/competition/delete/${id}`, { headers: this.headers });
  }
}
