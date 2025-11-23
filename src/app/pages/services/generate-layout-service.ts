import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class GenerateLayoutService {
  private dllUrl = 'http://127.0.0.1:5000/generate_DLL';
  private exeUrl = 'http://127.0.0.1:5000/generate_exe';

  constructor(private http: HttpService) {}

  generateDLL(payload: { filename: string; normal?: string[]; shift?: string[] }): Observable<any> {
    return this.http.post<any>(this.dllUrl, payload);
  }

  generateEXE(inputs: string): Observable<Blob> {
    return this.http.postBlob(this.exeUrl, { inputs });
  }
}
