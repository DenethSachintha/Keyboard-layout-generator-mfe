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

  /** -------------------------------------------------------------------
   *  🔹 Generate random letter frequencies (dynamic keys & values)
   *  ------------------------------------------------------------------- */
  private generateRandomLetterFreqs(): Record<string, number> {
    const possibleLetters = 'abcdefghijklmnopqrstuvwxyz'.split('');

    // Pick 8–12 random letters
    const count = Math.floor(Math.random() * 5) + 8;

    const freq: Record<string, number> = {};
    for (let i = 0; i < count; i++) {
      const l = possibleLetters[Math.floor(Math.random() * possibleLetters.length)];
      freq[l] = +(Math.random() * 15).toFixed(2); // random % 0–15
    }

    return freq;
  }

  /** -------------------------------------------------------------------
   *  🔹 Generate random bigram frequencies (dynamic keys & values)
   *  ------------------------------------------------------------------- */
  private generateRandomBigrams(): Record<string, number> {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const count = Math.floor(Math.random() * 10) + 10; // 10–20 bigrams

    const freq: Record<string, number> = {};
    for (let i = 0; i < count; i++) {
      const bg =
        letters[Math.floor(Math.random() * letters.length)] +
        letters[Math.floor(Math.random() * letters.length)];

      freq[bg] = +(Math.random() * 5).toFixed(2); // random % 0–5
    }

    return freq;
  }

  /** -------------------------------------------------------------------
   *  🔹 Simulate fetching OptionData for selected options
   *  ------------------------------------------------------------------- */
  getModifiedOptionData(): Observable<OptionData[]> {
    const savedOptions: OptionItem[] = this.workflow.getSelectedStyleOptions();

    const optionData: OptionData[] = savedOptions.map(opt => ({
      id: Math.floor(Math.random() * 1000),
      optionId: opt.id,
      steps: 300,
      start_qwerty: true,
      letter_freqs: this.generateRandomLetterFreqs(),
      bigram_freqs: this.generateRandomBigrams()
    }));

    // simulate async API
    return of(optionData);
  }
}
