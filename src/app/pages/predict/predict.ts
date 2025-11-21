import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WorkflowService } from '../../common/services/workflow.service';
import { PredictLayoutService } from '../services/predict-layout.service';
import { LayoutView } from '../../common/components/layout-view/layout-view';
import { KeyMapping } from '../../models/key-mapping';
import { OptionDataService } from '../services/option-data-service';
import { OptionData } from '../../models/option-data';
import { ImportsModule } from '../../imports';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-predict',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ImportsModule, LayoutView],
  templateUrl: './predict.html',
  styleUrls: ['./predict.scss'],
})
export class Predict implements OnInit {
  startQwerty: boolean = true;
  steps: number = 300;
  loading: boolean = false;
  score: number | null = null;
  layout: string = '';
  mapping: any = null;

  updatedKeymap = signal<KeyMapping[]>([]);
  selectedOptions: any[] = [];

  // 🔥 Store dynamic averages here
  avgLetterFreqs: Record<string, number> = {};
  avgBigramFreqs: Record<string, number> = {};

  constructor(
    private predictService: PredictLayoutService,
    private optionDataService: OptionDataService,
    private cd: ChangeDetectorRef,
    private workflowService: WorkflowService
  ) {}

  ngOnInit(): void {
    this.selectedOptions = this.workflowService.getSelectedStyleOptions();
    console.log('🔥 Selected Style Options:', this.selectedOptions);

    // Simulate API call for option data
    this.optionDataService.getModifiedOptionData().subscribe((data: OptionData[]) => {
      console.log('🔥 Retrieved OptionData', data);

      const { avgLetterFreqs, avgBigramFreqs } = this.calculateAverages(data);

      // Store for use in generate()
      this.avgLetterFreqs = avgLetterFreqs;
      this.avgBigramFreqs = avgBigramFreqs;

      console.log('📌 Average Letter Frequencies:', avgLetterFreqs);
      console.log('📌 Average Bigram Frequencies:', avgBigramFreqs);
    });

    const savedLayout = this.workflowService.getCurrentLayout();
    console.log('🔥 Saved Parsed Layout Rows:', savedLayout);
  }

  private calculateAverages(optionData: OptionData[]) {
    const count = optionData.length;

    const allLetterKeys = new Set<string>();
    const allBigramKeys = new Set<string>();

    optionData.forEach((obj) => {
      Object.keys(obj.letter_freqs).forEach((k) => allLetterKeys.add(k));
      Object.keys(obj.bigram_freqs).forEach((k) => allBigramKeys.add(k));
    });

    const letterSums: Record<string, number> = {};
    const bigramSums: Record<string, number> = {};

    allLetterKeys.forEach((k) => (letterSums[k] = 0));
    allBigramKeys.forEach((k) => (bigramSums[k] = 0));

    optionData.forEach((obj) => {
      allLetterKeys.forEach((key) => {
        letterSums[key] += obj.letter_freqs[key] ?? 0;
      });

      allBigramKeys.forEach((key) => {
        bigramSums[key] += obj.bigram_freqs[key] ?? 0;
      });
    });

    let avgLetterFreqs: Record<string, number> = {};
    let avgBigramFreqs: Record<string, number> = {};

    for (const key in letterSums) {
      avgLetterFreqs[key] = Number((letterSums[key] / count).toFixed(4));
    }

    for (const key in bigramSums) {
      avgBigramFreqs[key] = Number((bigramSums[key] / count).toFixed(4));
    }

    avgLetterFreqs = Object.fromEntries(
      Object.entries(avgLetterFreqs)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 9)
    );

    avgBigramFreqs = Object.fromEntries(
      Object.entries(avgBigramFreqs)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
    );

    return { avgLetterFreqs, avgBigramFreqs };
  }

  // ✅ Updated generate() to use dynamic values
  generate() {
    this.loading = true;

    const payload = {
      steps: this.steps,
      start_qwerty: this.startQwerty,
      letter_freqs: this.avgLetterFreqs,
      bigram_freqs: this.avgBigramFreqs,
    };

    this.predictService
      .generateLayout(payload)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cd.detectChanges();
        })
      )
      .subscribe({
        next: (updatedKeymap) => {
          this.workflowService.setKeymap(updatedKeymap);
          this.updatedKeymap.set(updatedKeymap);

          console.log('Updated FULL Keymap:', updatedKeymap);
        },
        error: (err) => {
          console.error('❌ Error generating layout:', err);
        },
      });
  }
}
