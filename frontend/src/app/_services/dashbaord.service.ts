import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

const API_URL = environment.apiURL;

@Injectable({
  providedIn: "root"
})
export class DashboardService {
  private headers = new HttpHeaders().set("Content-Type", "application/json");

  constructor(private http: HttpClient) {}

  getDashboardContents(): Observable<any> {
    return this.http.get(`${API_URL}/dashboard/allgraphs`, { headers: this.headers });
  }
}
