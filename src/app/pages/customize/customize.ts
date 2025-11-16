import { Component, computed, effect, OnInit, signal } from '@angular/core';
import { WorkflowService } from '../../common/services/workflow.service';
import { KeyMapping } from '../../models/key-mapping';
import { ImportsModule } from '../../imports';

@Component({
  selector: 'app-customize',
  standalone: true,
  imports: [ImportsModule],
  templateUrl: './customize.html',
  styleUrl: './customize.scss'
})
export class Customize implements OnInit {
  isShiftActive = false;
  expectedKeyId: number | null = null;

  activeKeys = signal<Record<number, boolean>>({});
  keyMapping = signal<KeyMapping[] | null>(null);

  constructor(private workflow: WorkflowService) {
    effect(() => {
      const keys = this.keyMapping();

      if (!keys || keys.length === 0) return;  // ⛔ Prevent null errors here

      this.processKeyMapping(keys);
      console.log('🔄 Reactive keyMapping update detected:', keys);
    });
  }

  ngOnInit(): void {
    const current = this.keyMapping();

    if (current && current.length > 0) {
      console.log("📌 Processing keyMapping on init:", current);
      this.processKeyMapping(current);
    }

    this.workflow.keymap$.subscribe(updatedMap => {
      console.log("🔥 Updated Keymap from WorkflowService:", updatedMap);
      this.keyMapping.set(updatedMap);
    });
  }

  private processKeyMapping(keys: KeyMapping[]): void {
    const map: Record<number, boolean> = {};
    keys.forEach(key => (map[key.id] = false));
    this.activeKeys.set(map);
  }

  // ⛔ FIX: Prevent errors until mapping exists
  get keyboardRows(): KeyMapping[][] {
    const keys = this.keyMapping();
    if (!keys || keys.length === 0) return [];   // 🔥 Crucial fix

    const rowBreaks = [14, 28, 41, 53, 61];
    const rows: KeyMapping[][] = [];

    let start = 0;
    for (const end of rowBreaks) {
      rows.push(keys.slice(start, end));
      start = end;
    }
    return rows;
  }

  highlightKey(key: string, state: boolean) {
    const mapping = this.keyMapping();
    if (!mapping) return;  // ⛔ Fix

    const found = mapping.find(k => k.systemKey.toLowerCase() === key.toLowerCase());
    if (found) {
      const active = this.activeKeys();
      this.activeKeys.set({ ...active, [found.id]: state });
    }
  }

  shouldShowShiftSymbol(key: KeyMapping): boolean {
    return (
      !!key.virtualShift &&
      !/^[a-zA-Z]$/.test(key.virtualKey) &&
      key.virtualKey.trim() !== ''
    );
  }

  getKeyBinding(key: KeyMapping) {
    return computed(() => {
      const active = !!this.activeKeys()[key.id];
      const expected = this.expectedKeyId === key.id;
      const shift =
        this.isShiftActive &&
        (key.systemKey === 'Shift' || key.virtualKey === 'Shift');

      const bg = expected
        ? 'bg-yellow-400 text-black'
        : active || shift
        ? 'bg-primary text-primary-contrast'
        : 'bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-200';

      return {
        class: ['key', bg],
        style: { transition: 'all 0.2s ease', cursor: 'pointer' },
        'data-key': key.id,
        'aria-label': key.virtualKey,
      };
    });
  }
}
