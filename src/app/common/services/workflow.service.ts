import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { KeyMapping } from '../../models/key-mapping';
import { ParsedLayout } from '../../models/parsed-layout';
import { OptionItem } from '../../models/option-item';


// workflow.service.ts

@Injectable({
  providedIn: 'root',
})
export class WorkflowService {
  private layoutSubject = new BehaviorSubject<ParsedLayout>({
    top: '',
    home: '',
    bottom: ''
  });
  layout$ = this.layoutSubject.asObservable();

  private keymapSubject = new BehaviorSubject<KeyMapping[]>([]);
  keymap$ = this.keymapSubject.asObservable();

  // NEW 🔥: Subject for drag/drop updates
  private keymapCustomSubject = new BehaviorSubject<KeyMapping[]>([]);
  keymapCustom$ = this.keymapCustomSubject.asObservable();

  // NEW: Store selected style options
  private selectedOptionsSubject = new BehaviorSubject<OptionItem[]>([]);
  selectedOptions$ = this.selectedOptionsSubject.asObservable();

  constructor() {}

  // ------------------- LAYOUT -------------------
  setLayout(layout: ParsedLayout) {
    this.layoutSubject.next(layout);
  }

  getCurrentLayout(): ParsedLayout {
    return this.layoutSubject.value;
  }

  // ------------------- KEYMAP (from model) -------------------
  setKeymap(mapping: KeyMapping[]) {
    this.keymapSubject.next(mapping);
  }

  getCurrentKeymap(): KeyMapping[] {
    return this.keymapSubject.value;
  }

  // ------------------- KEYMAP from drag/drop 🔥 -------------------
  updateKeymapByDragDrop(newMapping: KeyMapping[]) {
    this.keymapCustomSubject.next(newMapping);
  }

  getCurrentDraggedKeymap(): KeyMapping[] {
    return this.keymapCustomSubject.value;
  }

  // ------------------- STYLE OPTIONS -------------------
  setSelectedStyleOptions(options: OptionItem[]) {
    this.selectedOptionsSubject.next(options);
  }

  getSelectedStyleOptions(): OptionItem[] {
    return this.selectedOptionsSubject.value;
  }
}
