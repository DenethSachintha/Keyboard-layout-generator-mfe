import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class PredictLayoutService {
  private apiUrl = "http://127.0.0.1:5000/api/generate_layout";

  constructor(private http: HttpService) {}

  generateLayout(payload: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload);
  }
}
