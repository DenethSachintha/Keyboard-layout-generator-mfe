import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PredictLayoutService } from '../../services/predict-layout.service';

@Component({
  selector: 'app-predict',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputNumberModule,
    RadioButtonModule,
  ],
  templateUrl: './predict.html',
  styleUrls: ['./predict.scss'],
})
export class Predict {
  startQwerty: boolean = true; // will hold true/false
  steps: number = 300;
  loading: boolean = false;
  score: number | null = null;
  layout: string = '';
  mapping: any = null;

  constructor(private predictService: PredictLayoutService, private cd: ChangeDetectorRef) {}

  generate() {
    this.loading = true;

    const payload = {
      steps: this.steps,
      start_qwerty: this.startQwerty,
      letter_freqs: { e: 12.7, t: 9.1, a: 8.2, o: 7.5, i: 7.0, n: 6.7, s: 6.3, h: 6.1, r: 6.0 },
      bigram_freqs: {
        th: 3.5,
        he: 2.8,
        in: 2.0,
        er: 1.8,
        an: 1.6,
        re: 1.5,
        ed: 1.4,
        on: 1.3,
        es: 1.2,
        st: 1.1,
      },
    };

    this.predictService.generateLayout(payload).subscribe({
      next: (res) => {
        this.score = res.score;
        this.layout = res.layout;
        this.mapping = res.mapping;

        setTimeout(() => {
          // <-- fixes ExpressionChangedAfterItHasBeenCheckedError
          this.loading = false;
          this.cd.detectChanges();
        });
      },
      error: () => {
        setTimeout(() => {
          this.loading = false;
          this.cd.detectChanges();
        });
      },
    });
  }
}
