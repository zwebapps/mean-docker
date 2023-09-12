import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

// const API_URL = 'http://localhost:8080';

const API_URL = environment.apiURL;

@Injectable({
  providedIn: "root"
})
export class AcademyService {
  private headers = new HttpHeaders().set("Content-Type", "application/json");

  constructor(private http: HttpClient) {}

  loadAcademies(): Observable<any> {
    return this.http.get(`${API_URL}/academy/all`, { headers: this.headers });
  }
  createAcademy(academy: any): Observable<any> {
    return this.http.post(`${API_URL}/academy/create`, academy, { headers: this.headers });
  }
  getAcademyById(id: any): Observable<any> {
    return this.http.get(`${API_URL}/academy/${id}`, { headers: this.headers });
  }
  getAcademyByName(academy: any): Observable<any> {
    return this.http.post(`${API_URL}/academy/academybyname`, academy, { headers: this.headers });
  }
  getAcademyByCoachId(coachId: any): Observable<any> {
    return this.http.get(`${API_URL}/academy/academybycoach/${coachId}`, { headers: this.headers });
  }
  updateAcademy(id: any, academy: any): Observable<any> {
    return this.http.post(`${API_URL}/academy/update/${id}`, academy, { headers: this.headers });
  }
  updateAcademyCoach(id: any, academy: any): Observable<any> {
    return this.http.post(`${API_URL}/academy/updatecoach/${id}`, academy, { headers: this.headers });
  }
  deleteAcademy(id: any): Observable<any> {
    return this.http.post(`${API_URL}/academy/delete/${id}`, { headers: this.headers });
  }
}
