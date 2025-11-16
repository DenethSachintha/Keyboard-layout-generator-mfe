import {
  Component,
  Input,
  signal,
  computed,
  OnInit,
  effect,
} from '@angular/core';
import { ImportsModule } from '../../../imports';
import { CommonModule } from '@angular/common';
import { KeyMapping } from '../../../models/key-mapping';

@Component({
  selector: 'app-layout-view',
  imports: [ImportsModule, CommonModule],
  templateUrl: './layout-view.html',
  styleUrl: './layout-view.scss',
})
export class LayoutView implements OnInit {
  @Input({ required: true }) keyMapping!: ReturnType<typeof signal<KeyMapping[]>>;
  @Input() isShiftActive = false;
  @Input() expectedKeyId: number | null = null;

  activeKeys = signal<Record<number, boolean>>({});

  constructor() {
    // ✅ Automatically react to keyMapping changes
    effect(() => {
      const keys = this.keyMapping();
      if (keys.length > 0) {
        this.processKeyMapping(keys);
        console.log('🔄 Reactive keyMapping update detected in child:', keys);
      }
    });
  }

  ngOnInit(): void {
    if (this.keyMapping().length) {
      this.processKeyMapping(this.keyMapping());
      console.log('✅ Processing keyMapping on init:', this.keyMapping());
    }
  }

  private processKeyMapping(keys: KeyMapping[]): void {
    const newActiveKeys: Record<number, boolean> = {};
    for (const key of keys) {
      newActiveKeys[key.id] = false;
    }
    this.activeKeys.set(newActiveKeys);
  }

  get keyboardRows(): KeyMapping[][] {
    const rowBreaks = [14, 28, 41, 53, 61];
    const rows: KeyMapping[][] = [];
    let start = 0;
    const keys = this.keyMapping();
    for (const end of rowBreaks) {
      rows.push(keys.slice(start, end));
      start = end;
    }
    return rows;
  }

  highlightKey(key: string, state: boolean) {
    const found = this.keyMapping().find(
      (k) => k.systemKey.toLowerCase() === key.toLowerCase()
    );
    if (found) {
      const current = this.activeKeys();
      this.activeKeys.set({ ...current, [found.id]: state });
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
      const isActive = !!this.activeKeys()[key.id];
      const isExpected = this.expectedKeyId === key.id;
      const isShiftKey =
        this.isShiftActive &&
        (key.systemKey === 'Shift' || key.virtualKey === 'Shift');

      const bg = isExpected
        ? 'bg-yellow-400 text-black'
        : isActive || isShiftKey
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
