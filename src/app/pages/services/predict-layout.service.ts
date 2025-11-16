import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpService } from '../../common/services/http.service';
import { KeyMapping, baseKeyMapping } from '../../models/key-mapping';
import { WorkflowService } from '../../common/services/workflow.service';

@Injectable({
  providedIn: 'root',
})
export class PredictLayoutService {

  private apiUrl = "http://127.0.0.1:5000/api/generate_layout";

  constructor(
    private http: HttpService,
    private workflow: WorkflowService
  ) {}

  generateLayout(payload: any): Observable<KeyMapping[]> {
    return this.http.post<any>(this.apiUrl, payload).pipe(
      map(res => {

        // 1) Parse layout rows
        const parsed = this.parseLayout(res.layout);

        // Store parsed rows globally
        this.workflow.setLayout(parsed);

        // 2) Apply mapping to base keymap
        return this.applyLayoutToKeymap(parsed);
      })
    );
  }

  private parseLayout(layout: string): { top: string; home: string; bottom: string } {
    const lines = layout.split("\n").filter(x => x.trim().length > 0);

    return {
      top: lines[0].replace("TOP:", "").trim(),
      home: lines[1].replace("HOME:", "").trim(),
      bottom: lines[2].replace("BOTTOM:", "").trim(),
    };
  }

  private applyLayoutToKeymap(parsed: { top: string; home: string; bottom: string }): KeyMapping[] {

    const topLetters    = parsed.top.split("");
    const homeLetters   = parsed.home.split("");
    const bottomLetters = parsed.bottom.split("");

    const updated = [...baseKeyMapping].map(k => ({ ...k }));

    let topIndex = 0;
    let homeIndex = 0;
    let bottomIndex = 0;

    for (const key of updated) {

      if (/^[qwertyuiop]$/.test(key.systemKey)) {
        const n = topLetters[topIndex++];
        key.virtualKey = n;
        key.virtualShift = n.toUpperCase();
      }

      if (/^[asdfghjkl]$/.test(key.systemKey)) {
        const n = homeLetters[homeIndex++];
        key.virtualKey = n;
        key.virtualShift = n.toUpperCase();
      }

      if (/^[zxcvbnm]$/.test(key.systemKey)) {
        const n = bottomLetters[bottomIndex++];
        key.virtualKey = n;
        key.virtualShift = n.toUpperCase();
      }
    }

    return updated;
  }
}
