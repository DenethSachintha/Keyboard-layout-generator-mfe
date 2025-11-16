import { ChangeDetectorRef, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { WorkflowService } from '../../common/services/workflow.service';
import { PredictLayoutService } from '../services/predict-layout.service';
import { LayoutView } from "../../common/components/layout-view/layout-view";
import { KeyMapping } from '../../models/key-mapping';

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
    LayoutView
],
  templateUrl: './predict.html',
  styleUrls: ['./predict.scss'],
})
export class Predict {

  startQwerty: boolean = true;
  steps: number = 300;
  loading: boolean = false;
  score: number | null = null;     // remove later if score isn't needed
  layout: string = '';
  mapping: any = null;

  constructor(
    private predictService: PredictLayoutService,
    private cd: ChangeDetectorRef,
    private workflowService: WorkflowService
  ) {}

  updatedKeymap = signal<KeyMapping[]>([]);  // 🔥 SIGNAL CREATED

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
      next: (updatedKeymap) => {
        
        // Save full keymap into Workflow store
        this.workflowService.setKeymap(updatedKeymap);

        // 🔥 Update signal so child receives reactive changes
        this.updatedKeymap.set(updatedKeymap);

        console.log("Updated FULL Keymap:", updatedKeymap);
        console.log("Parsed Rows:", this.workflowService.getCurrentLayout());

        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }
}
