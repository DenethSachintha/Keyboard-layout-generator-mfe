import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ChipModule } from 'primeng/chip';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

interface Category {
  id: number;
  name: string;
}

interface OptionItem {
  id: number;
  name: string;
  categoryId: number;
  model: boolean;
  relatedIds: number[];
}

@Component({
  selector: 'app-typing-style',
  standalone: true,
  imports: [CommonModule, FormsModule, ToggleButtonModule, ChipModule, ButtonModule],
  templateUrl: './typing-style.html',
  styleUrls: ['./typing-style.scss']
})
export class TypingStyle {

  categories: Category[] = [
    { id: 1, name: 'Genre' },
    { id: 2, name: 'Language' },
    { id: 3, name: 'Rating' }
  ];

  allOptions: OptionItem[] = [
    { id: 101, name: 'Action', categoryId: 1, model: false, relatedIds: [201, 301] },
    { id: 102, name: 'Drama', categoryId: 1, model: false, relatedIds: [202] },
    { id: 103, name: 'Horror', categoryId: 1, model: false, relatedIds: [] },

    { id: 201, name: 'English', categoryId: 2, model: false, relatedIds: [] },
    { id: 202, name: 'Sinhala', categoryId: 2, model: false, relatedIds: [] },

    { id: 301, name: 'PG-13', categoryId: 3, model: false, relatedIds: [] },
    { id: 302, name: 'R Rated', categoryId: 3, model: false, relatedIds: [] }
  ];

  visibleOptions: OptionItem[] = structuredClone(this.allOptions);
  selectedOptions: OptionItem[] = [];

  onToggle(option: OptionItem) {
    if (option.model) {
      this.addSelection(option);
    } else {
      this.removeSelection(option);
    }
  }

  addSelection(option: OptionItem) {
    if (!this.selectedOptions.some(o => o.id === option.id)) {
      this.selectedOptions.push(option);
    }

    // Hide other options in the same category
    this.visibleOptions = this.visibleOptions.filter(
      o => o.categoryId !== option.categoryId || o.id === option.id
    );
  }

  removeSelection(option: OptionItem) {
    option.model = false;
    this.selectedOptions = this.selectedOptions.filter(o => o.id !== option.id);

    // Restore category options
    const stillSelectedInCategory = this.selectedOptions.some(
      o => o.categoryId === option.categoryId
    );

    if (!stillSelectedInCategory) {
      const catOptions = this.allOptions.filter(o => o.categoryId === option.categoryId);
      catOptions.forEach(o => {
        const clone = { ...o, model: false };
        if (!this.visibleOptions.some(v => v.id === clone.id)) {
          this.visibleOptions.push(clone);
        }
      });
    }

    this.visibleOptions = [...this.visibleOptions];
  }

  unselectByChip(option: OptionItem) {
    option.model = false;
    this.removeSelection(option);
  }
}
