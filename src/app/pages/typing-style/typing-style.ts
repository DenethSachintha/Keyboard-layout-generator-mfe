import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ImportsModule } from '../../imports';

@Component({
  selector: 'app-typing-style',
  standalone: true,
  imports: [CommonModule, FormsModule, ImportsModule],
  templateUrl: './typing-style.html',
  styleUrls: ['./typing-style.scss']
})
export class TypingStyle {

  allOptions: OptionItem[] = [
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

  /** Options shown to user — WITHOUT related ones initially */
  visibleOptions: OptionItem[] = [];

  /** Only contains user-selected items */
  selectedOptions: OptionItem[] = [];

  /** Related options activated by selected parents */
  activeRelated: Set<number> = new Set();

  constructor() {
    this.initializeVisibleOptions();
  }

  /** Hide ALL related options at startup */
  initializeVisibleOptions() {
    const relatedIds = new Set<number>();

    this.allOptions.forEach(o =>
      o.relatedIds.forEach(id => relatedIds.add(id))
    );

    // Only include non-related root options
    this.visibleOptions = this.allOptions.filter(o => !relatedIds.has(o.id));
  }

  /** Toggle logic */
  onToggle(option: OptionItem) {
    if (option.model) {
      this.selectOption(option);
    } else {
      this.unselectOption(option);
    }
  }

  /** Select an option */
  selectOption(option: OptionItem) {
    if (!this.selectedOptions.some(o => o.id === option.id)) {
      this.selectedOptions.push(option);
    }

    // Hide other items in the same category
    this.visibleOptions = this.visibleOptions.filter(
      o => o.categoryId !== option.categoryId || o.id === option.id
    );

    // Show related children (NOT selected)
    option.relatedIds.forEach(id => this.activeRelated.add(id));

    this.updateVisibleOptions();
  }

  /** Unselect option */
  unselectOption(option: OptionItem) {
    option.model = false;

    // Remove from selected list
    this.selectedOptions = this.selectedOptions.filter(o => o.id !== option.id);

    // Remove related visibility for this parent
    option.relatedIds.forEach(id => this.activeRelated.delete(id));

    // Restore category items only if nothing else in that category is selected
    const stillHasSelected = this.selectedOptions.some(o => o.categoryId === option.categoryId);

    if (!stillHasSelected) {
      const group = this.allOptions.filter(o => o.categoryId === option.categoryId);

      group.forEach(o => {
        if (!this.visibleOptions.some(v => v.id === o.id)) {
          this.visibleOptions.push({ ...o, model: false });
        }
      });
    }

    this.updateVisibleOptions();
  }

  /** Control final visibility set */
  updateVisibleOptions() {
    const baseVisible = new Set<number>();

    // Always show selected items + their categories
    this.selectedOptions.forEach(s => baseVisible.add(s.id));

    // Show related items
    this.activeRelated.forEach(id => baseVisible.add(id));

    // Show normal category items that are not restricted
    this.allOptions.forEach(opt => {
      const anySelectedInCat = this.selectedOptions.some(s => s.categoryId === opt.categoryId);

      if (!anySelectedInCat && !this.activeRelated.has(opt.id)) {
        // This is a root category item
        baseVisible.add(opt.id);
      }
    });

    // Convert to visibleOptions
    this.visibleOptions = this.allOptions
      .filter(o => baseVisible.has(o.id))
      .map(o => ({ ...o, model: o.model }));
  }

  /** Chip unselect */
  unselectByChip(opt: OptionItem) {
    const real = this.allOptions.find(o => o.id === opt.id);
    if (real) {
      real.model = false;
      this.unselectOption(real);
    }
  }
}
