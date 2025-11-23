import { Component, signal, OnInit } from '@angular/core';
import { WorkflowService } from '../../common/services/workflow.service';
import { LayoutView } from "../../common/components/layout-view/layout-view";
import { KeyMapping } from '../../models/key-mapping';
import { GenerateLayoutService } from '../services/generate-layout-service';

@Component({
  selector: 'app-generate',
  imports: [LayoutView],
  templateUrl: './generate.html',
  styleUrl: './generate.scss'
})
export class Generate implements OnInit {

  keyMapping = signal<KeyMapping[]>([]);
  exeInputs: string = 'Layout01';

  default_normal: string[] = [];
  default_shift: string[] = [];

  constructor(
    private workflow: WorkflowService,
    private generateService: GenerateLayoutService
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
      "'1'", "'2'", "'3'", "'4'", "'5'", "'6'", "'7'", "'8'", "'9'", "'0'",
      "'-'", "'='", "'q'", "'w'", "'e'", "'r'", "'t'", "'y'", "'u'", "'i'",
      "'o'", "'p'", "'['", "']'", "'a'", "'s'", "'d'", "'f'", "'g'", "'h'",
      "'j'", "'k'", "'l'", "';'", "'\\''", "'`'", "'\\\\'", "'z'", "'x'", "'c'",
      "'v'", "'b'", "'n'", "'m'", "','", "'.'", "'/'", "' '", "'\\\\'", "'.'",
      "'\\b'", "0x001b", "'\\r'", "0x0003"
    ];

    const shift = [
      "'!'", "'@'", "'#'", "'$'", "'%'", "'^'", "'&'", "'*'", "'('", "')'",
      "'_'", "'+'", "'Q'", "'W'", "'E'", "'R'", "'T'", "'Y'", "'U'", "'I'",
      "'O'", "'P'", "'{'", "'}'", "'A'", "'S'", "'D'", "'F'", "'G'", "'H'",
      "'J'", "'K'", "'L'", "':'", "'\"'", "'~'", "'|'", "'Z'", "'X'", "'C'",
      "'V'", "'B'", "'N'", "'M'", "'<'", "'>'", "'?'", "' '", "'|'", "'.'",
      "'\\b'", "0x001b", "'\\r'", "0x0003"
    ];

    const toLiteral = (key: string | undefined): string => {
      if (!key) return "''";
      switch (key) {
        case "Backspace": return "'\\b'";
        case "Enter": return "'\\r'";
        case "Esc": return "0x001b";
        case "Ctrl": return "0x0003";
        case "'": return "'\\''";
        case "\"": return "'\\\"'";
        case "\\": return "'\\\\'";
        case " ": return "' '";
      }
      return `'${key}'`;
    };

    // Key ranges
    const ranges = [
      { start: 0, count: 12, keysStart: 2 },   // keys 2–13
      { start: 12, count: 12, keysStart: 16 }, // keys 16–27
      { start: 24, count: 11, keysStart: 30 }, // keys 30–40
      { start: 37, count: 10, keysStart: 43 }  // keys 43–52
    ];

    ranges.forEach(range => {
      for (let i = 0; i < range.count; i++) {
        const key = keys[range.keysStart + i - 1];
        if (!key) continue;
        normal[range.start + i] = toLiteral(key.virtualKey);
        shift[range.start + i] = toLiteral(key.virtualShift ?? key.virtualKey);
      }
    });

    console.log("normal = [\n  " + normal.join(", ") + "\n]");
    console.log("shift = [\n  " + shift.join(", ") + "\n]");

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
      filename: "Layout01",
      normal: this.default_normal,
      shift: this.default_shift,
    };

    this.generateService.generateDLL(payload).subscribe({
      next: (res) => console.log("DLL generated!", res),
      error: (err) => console.error("DLL generation error:", err)
    });
  }
   
  generateExecutable() {
    if (!this.exeInputs.trim()) {
      alert("Please enter inputs");
      return;
    }

    this.generateService.generateEXE(this.exeInputs).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "custom_executable.exe";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      },
      error: (err) => {
        console.error(err);
        alert("Failed to generate EXE");
      }
    });
  }



}
