import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { WorkflowService } from '../../common/services/workflow.service';
import { OptionItem } from '../../models/option-item';
import { OptionData } from '../../models/option-data';

@Injectable({
  providedIn: 'root',
})
export class OptionDataService {

  constructor(private workflow: WorkflowService) {}

  /** 🔹 Simulate fetching OptionData for selected options */
  getModifiedOptionData(): Observable<OptionData[]> {
    const savedOptions: OptionItem[] = this.workflow.getSelectedStyleOptions();

    const optionData: OptionData[] = savedOptions.map(opt => ({
      id: Math.floor(Math.random() * 1000),  // simulate server-generated ID
      optionId: opt.id,
      steps: 300,
      start_qwerty: true,
      letter_freqs: { e: 12.7, t: 9.1, a: 8.2, o: 7.5, i: 7.0, n: 6.7, s: 6.3, h: 6.1, r: 6.0 },
      bigram_freqs: {
        th: 3.5, he: 2.8, in: 2.0, er: 1.8, an: 1.6,
        re: 1.5, ed: 1.4, on: 1.3, es: 1.2, st: 1.1
      }
    }));

    // simulate async API
    return of(optionData);
  }
}
