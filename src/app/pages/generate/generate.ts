import { Component,NgZone, signal, OnInit, ChangeDetectorRef } from '@angular/core';
import { WorkflowService } from '../../common/services/workflow.service';
import { LayoutView } from '../../common/components/layout-view/layout-view';
import { KeyMapping } from '../../models/key-mapping';
import { GenerateLayoutService } from '../services/generate-layout-service';
import { delay } from 'rxjs';
import { ImportsModule } from '../../imports';

@Component({
  selector: 'app-generate',
  imports: [LayoutView, ImportsModule],
  templateUrl: './generate.html',
  styleUrl: './generate.scss',
})
export class Generate implements OnInit {
  keyMapping = signal<KeyMapping[]>([]);

  default_normal: string[] = [];
  default_shift: string[] = [];

  exeInputs: string = 'Layout01';
  visible: boolean = false;
  step: number = 1;

  constructor(
    private workflow: WorkflowService,
    private generateService: GenerateLayoutService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.workflow.keymapCustom$.subscribe((keys: KeyMapping[]) => {
      if (!keys || keys.length === 0) return;

      this.keyMapping.set(keys);
      console.log('Loaded keyMapping for generation:', keys);

      this.buildNormalShiftArrays(keys);
    });
  }

  /**
   * Build normal[] and shift[] arrays using keyMapping rules
   */
  private buildNormalShiftArrays(keys: KeyMapping[]): void {
    // Fresh arrays
    const normal = [
      "'1'",
      "'2'",
      "'3'",
      "'4'",
      "'5'",
      "'6'",
      "'7'",
      "'8'",
      "'9'",
      "'0'",
      "'-'",
      "'='",
      "'q'",
      "'w'",
      "'e'",
      "'r'",
      "'t'",
      "'y'",
      "'u'",
      "'i'",
      "'o'",
      "'p'",
      "'['",
      "']'",
      "'a'",
      "'s'",
      "'d'",
      "'f'",
      "'g'",
      "'h'",
      "'j'",
      "'k'",
      "'l'",
      "';'",
      "'\\''",
      "'`'",
      "'\\\\'",
      "'z'",
      "'x'",
      "'c'",
      "'v'",
      "'b'",
      "'n'",
      "'m'",
      "','",
      "'.'",
      "'/'",
      "' '",
      "'\\\\'",
      "'.'",
      "'\\b'",
      '0x001b',
      "'\\r'",
      '0x0003',
    ];

    const shift = [
      "'!'",
      "'@'",
      "'#'",
      "'$'",
      "'%'",
      "'^'",
      "'&'",
      "'*'",
      "'('",
      "')'",
      "'_'",
      "'+'",
      "'Q'",
      "'W'",
      "'E'",
      "'R'",
      "'T'",
      "'Y'",
      "'U'",
      "'I'",
      "'O'",
      "'P'",
      "'{'",
      "'}'",
      "'A'",
      "'S'",
      "'D'",
      "'F'",
      "'G'",
      "'H'",
      "'J'",
      "'K'",
      "'L'",
      "':'",
      "'\"'",
      "'~'",
      "'|'",
      "'Z'",
      "'X'",
      "'C'",
      "'V'",
      "'B'",
      "'N'",
      "'M'",
      "'<'",
      "'>'",
      "'?'",
      "' '",
      "'|'",
      "'.'",
      "'\\b'",
      '0x001b',
      "'\\r'",
      '0x0003',
    ];

    const toLiteral = (key: string | undefined): string => {
      if (!key) return "''";
      switch (key) {
        case 'Backspace':
          return "'\\b'";
        case 'Enter':
          return "'\\r'";
        case 'Esc':
          return '0x001b';
        case 'Ctrl':
          return '0x0003';
        case "'":
          return "'\\''";
        case '"':
          return "'\\\"'";
        case '\\':
          return "'\\\\'";
        case ' ':
          return "' '";
      }
      return `'${key}'`;
    };

    // Key ranges
    const ranges = [
      { start: 0, count: 12, keysStart: 2 }, // keys 2–13
      { start: 12, count: 12, keysStart: 16 }, // keys 16–27
      { start: 24, count: 11, keysStart: 30 }, // keys 30–40
      { start: 37, count: 10, keysStart: 43 }, // keys 43–52
    ];

    ranges.forEach((range) => {
      for (let i = 0; i < range.count; i++) {
        const key = keys[range.keysStart + i - 1];
        if (!key) continue;
        normal[range.start + i] = toLiteral(key.virtualKey);
        shift[range.start + i] = toLiteral(key.virtualShift ?? key.virtualKey);
      }
    });

    console.log('normal = [\n  ' + normal.join(', ') + '\n]');
    console.log('shift = [\n  ' + shift.join(', ') + '\n]');

    if (normal.length !== 54 || shift.length !== 54) {
      console.error(`❌ Key count mismatch! Normal=${normal.length}, Shift=${shift.length}`);
    }

    this.default_normal = normal;
    this.default_shift = shift;
  }

  /**
   * Generate DLL on button click
   */
  onGenerateDLL(): void {
    const payload = {
      filename: 'Layout01',
      normal: this.default_normal,
      shift: this.default_shift,
    };

    this.generateService.generateDLL(payload).subscribe({
      next: (res) => console.log('DLL generated!', res),
      error: (err) => console.error('DLL generation error:', err),
    });
  }

  // ---------------- SHOW DIALOG ----------------
  showDialog() {
    this.visible = true;
    this.step = 1;
  }

  // Fired AFTER dialog animation is fully done
  onDialogShown() {
    // No auto actions here yet
  }

  // ---------------- STEP 1 Confirm ----------------
  startProcess() {
    // Delay step change to avoid ExpressionChanged error
    setTimeout(() => {
      this.step = 2;
      this.cdr.detectChanges();

      // Give dialog time to render step 2 cleanly
      setTimeout(() => this.runStep2_DLL(), 300);
    }, 50);
  }

  // ---------------- STEP 2 DLL ----------------
  runStep2_DLL() {
    const payload = {
      filename: 'Layout01',
      normal: this.default_normal,
      shift: this.default_shift,
    };

    this.generateService
      .generateDLL(payload)
      .pipe(delay(2000))
      .subscribe({
        next: () => {
          console.log('DLL generated.');

          // Delay UI update to avoid Angular change errors
          setTimeout(() => {
            this.step = 3;
            this.cdr.detectChanges();

            setTimeout(() => this.runStep3_EXE(), 300);
          }, 50);
        },
        error: (err) => {
          console.error(err);
          alert('DLL generation failed.');
        },
      });
  }

  // ---------------- STEP 3 EXE ----------------
  runStep3_EXE() {
    this.generateService
      .generateEXE(this.exeInputs)
      .pipe(delay(2000))
      .subscribe({
        next: (blob: Blob) => {
          // Download EXE
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'custom_layout.exe';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);

          // Delay UI update
          setTimeout(() => {
            this.step = 4;
            this.cdr.detectChanges();
          }, 50);
        },
        error: () => alert('EXE generation failed.'),
      });
  }

  closeDialog() {
    this.visible = false;
    this.step = 1;
  }

  onDialogClose() {
  // give dialog time to unmount
  setTimeout(() => {
    const elementToFocus = document.querySelector('.focus-target') as HTMLElement;
    if (elementToFocus) {
      elementToFocus.focus();
    }
  }, 550);
}



}
