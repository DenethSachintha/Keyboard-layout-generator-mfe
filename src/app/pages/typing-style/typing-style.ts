import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ImportsModule } from '../../imports';
import { OptionItem } from '../../models/option-item';
import { StyleOptionService } from '../services/style-option-service';

@Component({
  selector: 'app-typing-style',
  standalone: true,
  imports: [CommonModule, FormsModule, ImportsModule],
  templateUrl: './typing-style.html',
  styleUrls: ['./typing-style.scss']
})
export class TypingStyle implements OnInit{

  allOptions: OptionItem[] = [];
  isLoading: boolean = true;
  visibleOptions: OptionItem[] = [];
  selectedOptions: OptionItem[] = [];
  activeRelated: Set<number> = new Set();

constructor(
  private styleOptionService: StyleOptionService,
  private cdr: ChangeDetectorRef
) {}
ngOnInit(): void {
  this.loadOptionsFromApi();
}
loadOptionsFromApi() {
  this.styleOptionService.getAllOptions().subscribe({
    next: (options) => {

      this.allOptions = options.map(o => ({ ...o, model: false }));
      this.allOptions = [...this.allOptions];

      this.initializeVisibleOptions();

      console.log('Loaded options:', this.allOptions);

      /** 🔥 Force Angular to detect UI changes */
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Failed to load options:', err);
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  });
}

  /** Hide ALL related options at startup */
  initializeVisibleOptions() {
    const relatedIds = new Set<number>();

    this.allOptions.forEach(o =>
      o.relatedIds.forEach(id => relatedIds.add(id))
    );

    // Only include non-related root options
    this.visibleOptions = this.allOptions.filter(o => !relatedIds.has(o.id));

    // Force Angular render
    this.visibleOptions = [...this.visibleOptions];

    this.isLoading = false;
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

    this.selectedOptions = this.selectedOptions.filter(o => o.id !== option.id);

    option.relatedIds.forEach(id => this.activeRelated.delete(id));

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

    this.selectedOptions.forEach(s => baseVisible.add(s.id));
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
