import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { OptionItem } from '../../models/option-item';

@Injectable({
  providedIn: 'root',
})
export class StyleOptionService {

  /** ✔ Simulated backend data */
private mockOptions: OptionItem[] = [
  // ------------------------------------------------------
  // CATEGORY 1 — USER TYPE (Parent)
  // Only one visible at a time (Typist / Programmer / Writer / Gamer)
  // ------------------------------------------------------
  { id: 101, name: 'Typist', categoryId: 1, model: false, relatedIds: [] },
  { id: 102, name: 'Programmer', categoryId: 1, model: false, relatedIds: [505, 506, 507, 508,509,510] },
  { id: 103, name: 'Writer', categoryId: 1, model: false, relatedIds: [ 303] },
  { id: 104, name: 'Gamer', categoryId: 1, model: false, relatedIds: [601, 602] },

  // ------------------------------------------------------
  // CATEGORY 2 — LANGUAGE PREFERENCE (Child of Typist / Writer)
  // ------------------------------------------------------
  { id: 201, name: 'English', categoryId: 2, model: false, relatedIds: [] },
  { id: 202, name: 'Sinhala', categoryId: 9, model: false, relatedIds: [] },
  { id: 203, name: 'Formal English', categoryId: 10, model: false, relatedIds: [] },

  // ------------------------------------------------------
  // CATEGORY 3 — TYPING PRIORITY (Child of Typist / Writer)
  // ------------------------------------------------------
  { id: 301, name: 'Speed', categoryId: 3, model: false, relatedIds: [] },
  { id: 302, name: 'Accuracy', categoryId: 3, model: false, relatedIds: [] },
  { id: 303, name: 'Balanced', categoryId: 3, model: false, relatedIds: [] },

  // ------------------------------------------------------
  // CATEGORY 4 — HAND PREFERENCE (Visible only when needed)
  // ------------------------------------------------------
  { id: 401, name: 'Left-Handed', categoryId: 4, model: false, relatedIds: [] },
  { id: 402, name: 'Right-Handed', categoryId: 4, model: false, relatedIds: [] },
  { id: 403, name: 'Both-Hands', categoryId: 4, model: false, relatedIds: [] },

  // ------------------------------------------------------
  // CATEGORY 5 — PROGRAMMING LANGUAGES (Child of Programmer)
  // ------------------------------------------------------
  { id: 505, name: 'Python', categoryId: 5, model: false, relatedIds: [] },
  { id: 506, name: 'JavaScript', categoryId: 5, model: false, relatedIds: [] },
  { id: 507, name: 'HTML', categoryId: 5, model: false, relatedIds: [] },
  { id: 508, name: 'CSS', categoryId: 5, model: false, relatedIds: [] },
  { id: 509, name: 'C++', categoryId: 5, model: false, relatedIds: [] },
  { id: 510, name: 'Java', categoryId: 5, model: false, relatedIds: [] },

  // ------------------------------------------------------
  // CATEGORY 6 — GAMING STYLE (Child of Gamer)
  // ------------------------------------------------------
  { id: 601, name: 'FPS Games', categoryId: 6, model: false, relatedIds: [] },
  { id: 602, name: 'MOBA Games', categoryId: 6, model: false, relatedIds: [] },

  // ------------------------------------------------------
  // CATEGORY 8 — SPECIAL CONDITIONS (Optional)
  // ------------------------------------------------------
  { id: 801, name: 'Beginner', categoryId: 8, model: false, relatedIds: [] }
];


  constructor() {}

  /** ✔ Simulate API GET returning all options */
  getAllOptions(): Observable<OptionItem[]> {
    return of(this.mockOptions).pipe(delay(400)); // fake API delay
  }

  /** ✔ API to get options by category */
  getOptionsByCategory(categoryId: number): Observable<OptionItem[]> {
    const filtered = this.mockOptions.filter(o => o.categoryId === categoryId);
    return of(filtered).pipe(delay(300));
  }
}
