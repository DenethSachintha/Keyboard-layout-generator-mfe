import { Component, signal, OnInit, computed, ChangeDetectorRef } from '@angular/core';
import { ImportsModule } from '../../imports';
import { WorkflowService } from '../../common/services/workflow.service';
import { CommonModule } from '@angular/common';
import { KeyMapping } from '../../models/key-mapping';
import { HttpClient } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-customize',
  standalone: true,
  imports: [ImportsModule, CommonModule],
  templateUrl: './customize.html',
  styleUrl: './customize.scss',
})
export class Customize implements OnInit {
  keyMapping = signal<KeyMapping[]>([]);
  draggingKeyIndex: number | null = null;
  showSaveInput = signal(false);

  workflowName: string = ''; // <-- for input binding

  constructor(
    private workflow: WorkflowService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

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

    // 🔥 Update WorkflowService
    this.workflow.updateKeymapByDragDrop(keys);

    // ✅ Show save input after first drag-drop
    this.showSaveInput.set(true);
    this.cdr.detectChanges(); // force template update


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

  saveWorkflowItem() {
    if (!this.workflowName.trim()) {
      alert('Name is required!');
      return;
    }

    // 1️⃣ First API payload
    const workflowPayload = {
      name: this.workflowName,
      workflowProcessId: uuidv4(), // generate new GUID
      createDate: new Date().toISOString(), // current timestamp
      subComponentCode: 'predict',
    };

    // First API call
    this.http
      .post<any>('https://localhost:7077/api/WorkflowProcessItems', workflowPayload)
      .subscribe({
        next: (workflowRes) => {
          console.log('Workflow item saved:', workflowRes);

          // 2️⃣ Prepare KeyMappings payload including OrderId
          const keyMappingsPayload = this.keyMapping().map((k, index) => ({
            workflowProcessItemId: workflowRes.id, // Use returned ID
            systemKey: k.systemKey,
            virtualKey: k.virtualKey,
            systemShift: k.systemShift,
            virtualShift: k.virtualShift,
            orderId: index + 1, // start order from 1
          }));

          // Second API call
          this.http
            .post('https://localhost:7077/api/KeyMappings/bulk', keyMappingsPayload)
            .subscribe({
              next: (keyMapRes) => {
                console.log('KeyMappings saved:', keyMapRes);
                this.showSaveInput.set(false);
                this.cdr.detectChanges();                
                this.workflowName = ''; // reset input
              },
              error: (err) => {
                console.error('Error saving KeyMappings', err);
                alert('Error saving KeyMappings!');
              },
            });
        },
        error: (err) => {
          console.error('Error saving workflow item', err);
          alert('Error saving workflow item!');
        },
      });
  }
}
