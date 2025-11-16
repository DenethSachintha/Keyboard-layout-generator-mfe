import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { OptionItem } from '../../models/option-item';

@Injectable({
  providedIn: 'root',
})
export class StyleOptionService {

  /** ✔ Simulated backend data */
  private mockOptions: OptionItem[] = [
    { id: 101, name: 'Typist', categoryId: 1, model: false, relatedIds: [201, 301] },
    { id: 102, name: 'Programmer', categoryId: 1, model: false, relatedIds: [505, 506, 507, 508] },

    { id: 201, name: 'English', categoryId: 2, model: false, relatedIds: [] },
    { id: 202, name: 'Sinhala', categoryId: 2, model: false, relatedIds: [] },

    { id: 301, name: 'Speed', categoryId: 3, model: false, relatedIds: [] },
    { id: 302, name: 'Accuracy', categoryId: 3, model: false, relatedIds: [] },

    { id: 505, name: 'Python', categoryId: 5, model: false, relatedIds: [] },
    { id: 506, name: 'JavaScript', categoryId: 5, model: false, relatedIds: [] },
    { id: 507, name: 'HTML', categoryId: 5, model: false, relatedIds: [] },
    { id: 508, name: 'CSS', categoryId: 5, model: false, relatedIds: [] },
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
