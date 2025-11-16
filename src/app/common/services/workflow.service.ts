import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { KeyMapping } from '../../models/key-mapping';

export interface ParsedLayout {
  top: string;
  home: string;
  bottom: string;
}

@Injectable({
  providedIn: 'root',
})
export class WorkflowService {

  // --------------------------
  // Store parsed layout rows
  // --------------------------
  private layoutSubject = new BehaviorSubject<ParsedLayout>({
    top: '',
    home: '',
    bottom: ''
  });
  layout$ = this.layoutSubject.asObservable();

  // --------------------------
  // Store full keymap
  // --------------------------
  private keymapSubject = new BehaviorSubject<KeyMapping[]>([]);
  keymap$ = this.keymapSubject.asObservable();

  constructor() {}

  // Store parsed layout rows
  setLayout(layout: ParsedLayout) {
    this.layoutSubject.next(layout);
  }

  getCurrentLayout(): ParsedLayout {
    return this.layoutSubject.value;
  }

  // Store updated keymap
  setKeymap(mapping: KeyMapping[]) {
    this.keymapSubject.next(mapping);
  }

  getCurrentKeymap(): KeyMapping[] {
    return this.keymapSubject.value;
  }
}
