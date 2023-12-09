import { Injectable } from "@angular/core";
import { HttpClient, HttpEvent, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "../../environments/environment";

// const API_URL = 'http://localhost:8080';
const API_URL = environment.apiURL;

@Injectable({
  providedIn: "root"
})
export class PlayerService {
  private headers = new HttpHeaders().set("Content-Type", "application/json");
  private fileHeaders = new HttpHeaders().set("Content-Type", "multipart/form-data");

  constructor(private http: HttpClient) {}

  loadPlayers(): Observable<any> {
    return this.http.get(`${API_URL}/player/all`, { headers: this.headers });
  }
  loadPlayersByCompitition(compitition: string): Observable<any> {
    return this.http.get(`${API_URL}/player/forcompitition/${compitition}`, { headers: this.headers });
  }
  loadPlayersByShortcode(shortcode: string): Observable<any> {
    return this.http.get(`${API_URL}/player/forshortcode/${shortcode}`, { headers: this.headers });
  }
  approvePlayer(id: any, data: any): Observable<any> {
    return this.http.post(`${API_URL}/player/approve/${id}`, data, { headers: this.headers });
  }

  deletePlayer(id: any): Observable<any> {
    return this.http.post(`${API_URL}/player/delete/${id}`, { headers: this.headers });
  }

  updatePlayer(id: any, playerData): Observable<any> {
    return this.http.post(`${API_URL}/player/update/${id}`, playerData, { headers: this.headers });
  }

  getPlayerById(id: any): Observable<any> {
    return this.http.get(`${API_URL}/player/academy/${id}`, { headers: this.headers });
  }
  upload(file: File): Observable<any> {
    const formData = new FormData();
    // Store form name as "file" with file data
    formData.append("file", file);
    return this.http.post(`${API_URL}/player/upload`, formData);
  }

  uploadImages(files: File[]): Observable<any> {
    const formData = new FormData();
    // Store form name as "file" with file data
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    return this.http.post(`${API_URL}/player/multiupload`, formData);
  }

  uploadContact(file: File): Observable<any> {
    const formData = new FormData();
    // Store form name as "file" with file data
    formData.append("file", file);
    return this.http.post(`${API_URL}/player/contactdata`, formData, { headers: this.headers });
  }

  getListFiles(): Observable<any> {
    return this.http.get(`${API_URL}/player/getuploads`, { headers: this.headers });
  }

  getFile(id: string): Observable<any> {
    return this.http.get(`${API_URL}/player/getuploads/${id}`, { headers: this.headers });
  }
  createPlayer(player: any): Observable<any> {
    return this.http.post(`${API_URL}/player/create`, player, { headers: this.headers });
  }
  getPlayerbyEmirateId(id: any): Observable<any> {
    return this.http.get(`${API_URL}/player/${id}`, { headers: this.headers });
  }
  getPlayerByTeamId(id: any): Observable<any> {
    return this.http.get(`${API_URL}/player/team/${id}`, { headers: this.headers });
  }

  importPlayers(players: any): Observable<any> {
    return this.http.post(`${API_URL}/player/bulkuploads`, players, { headers: this.headers });
  }

  updateMultiplePlayers(players: any): Observable<any> {
    return this.http.post(`${API_URL}/player/approvemulitple`, players, { headers: this.headers });
  }
}
