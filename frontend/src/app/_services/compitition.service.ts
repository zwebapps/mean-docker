import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

const API_URL = environment.apiURL;

@Injectable({
  providedIn: "root"
})
export class CompititionService {
  private headers = new HttpHeaders().set("Content-Type", "application/json");

  constructor(private http: HttpClient) {}

  getCompititions(): Observable<any> {
    return this.http.get(`${API_URL}/compitition/all`, { headers: this.headers });
  }
  createCompitition(compitition: any): Observable<any> {
    return this.http.post(`${API_URL}/compitition/create`, compitition, { headers: this.headers });
  }
  getCompititionById(id: any): Observable<any> {
    return this.http.get(`${API_URL}/compitition/${id}`, { headers: this.headers });
  }
  getCompititionByName(compitition: any): Observable<any> {
    return this.http.post(`${API_URL}/compitition/compititionbyname`, compitition, { headers: this.headers });
  }

  getCompititionByShortCode(compitition: any): Observable<any> {
    return this.http.get(`${API_URL}/compitition/shortcode/${compitition}`, { headers: this.headers });
  }

  updateCompitition(id: any, compitition: any): Observable<any> {
    return this.http.post(`${API_URL}/compitition/update/${id}`, compitition, { headers: this.headers });
  }
  deleteCompitition(id: any): Observable<any> {
    return this.http.post(`${API_URL}/compitition/delete/${id}`, { headers: this.headers });
  }
}
