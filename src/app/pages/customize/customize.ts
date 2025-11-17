import { Component, signal, OnInit, computed } from '@angular/core';
import { ImportsModule } from '../../imports';
import { WorkflowService } from '../../common/services/workflow.service';

export interface KeyMapping {
  id: number;
  systemKey: string;
  virtualKey: string;
}

@Component({
  selector: 'app-customize',
  standalone: true,
  imports: [ImportsModule],
  templateUrl: './customize.html',
  styleUrl: './customize.scss'
})
export class Customize implements OnInit {

  keyMapping = signal<KeyMapping[]>([]);
  draggingKeyIndex: number | null = null;

  constructor(private workflow: WorkflowService) {}

  ngOnInit(): void {
    this.workflow.keymap$.subscribe((keys: KeyMapping[]) => {
      if (!keys || keys.length === 0) return;
      this.keyMapping.set(keys);
      console.log('Loaded keyMapping:', keys);
    });
  }

  /** Split keys into rows */
  keyboardRows = computed(() => {
    const keys = this.keyMapping();
    if (!keys || keys.length === 0) return [];

    // Example row pattern: 14-14-13-12-8 etc.
    const rowBreaks = [14, 28, 41, 53, 61];
    const rows: KeyMapping[][] = [];
    let start = 0;
    for (const end of rowBreaks) {
      rows.push(keys.slice(start, end));
      start = end;
    }
    // Push remaining keys if any
    if (start < keys.length) {
      rows.push(keys.slice(start));
    }
    return rows;
  });

  /** -----------------------------
   * Drag & Drop logic
   * -----------------------------
   */

  onDragStart(event: DragEvent, flatIndex: number) {
    this.draggingKeyIndex = flatIndex;
    event.dataTransfer?.setData('text/plain', flatIndex.toString());
    event.dataTransfer!.effectAllowed = 'move';
    console.log('Dragging started:', flatIndex);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';
  }

  onDragEnter(event: DragEvent, flatIndex: number) {
    event.preventDefault();
  }

  onDrop(event: DragEvent, dropIndex: number) {
    event.preventDefault();
    const fromIndex = this.draggingKeyIndex;
    if (fromIndex === null || fromIndex === dropIndex) return;

    const keys = [...this.keyMapping()];
    [keys[fromIndex], keys[dropIndex]] = [keys[dropIndex], keys[fromIndex]];
    this.keyMapping.set(keys);

    console.log('Dropped keys:', keys);
    this.draggingKeyIndex = null;
  }

  onDragEnd() {
    this.draggingKeyIndex = null;
  }

  trackById(index: number, item: KeyMapping) {
    return item.id;
  }

  /** Compute flat index for drag-drop across rows */
  flatIndex(rowIndex: number, keyIndex: number): number {
    const rows = this.keyboardRows();
    let index = 0;
    for (let i = 0; i < rowIndex; i++) {
      index += rows[i].length;
    }
    return index + keyIndex;
  }
}
