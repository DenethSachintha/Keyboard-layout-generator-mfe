import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ImportsModule } from '../../imports';
import { OptionItem } from '../../models/option-item';
import { StyleOptionService } from '../services/style-option-service';
import { WorkflowService } from '../../common/services/workflow.service';

@Component({
  selector: 'app-typing-style',
  standalone: true,
  imports: [CommonModule, FormsModule, ImportsModule],
  templateUrl: './typing-style.html',
  styleUrls: ['./typing-style.scss'],
})
export class TypingStyle implements OnInit {
  allOptions: OptionItem[] = [];
  visibleOptions: OptionItem[] = [];
  selectedOptions: OptionItem[] = [];
  activeRelated: Set<number> = new Set();
  isLoading = true;

  constructor(
    private styleOptionService: StyleOptionService,
    private workflow: WorkflowService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadOptions();
  }

  /** -------------------------------
   *  LOAD + RESTORE SAVED STATE
   * ------------------------------- */
  loadOptions() {
    this.styleOptionService.getAllOptions().subscribe({
      next: (options) => {
        this.allOptions = options.map((o) => ({ ...o, model: false }));
        console.log('Loaded style options:', this.allOptions);

        /** Restore previously selected */
        const saved = this.workflow.getSelectedStyleOptions() ?? [];

        saved.forEach((sItem) => {
          const opt = this.allOptions.find((o) => o.id === sItem.id);
          if (opt) {
            opt.model = true;
            this.selectedOptions.push(opt);
            opt.relatedIds.forEach((id) => this.activeRelated.add(id));
          }
        });

        /** Initial visibility = ONLY ROOT, no children */
        this.initializeRootVisibility();

        /** And then add restored children */
        this.appendActiveChildren();

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  /** -------------------------------
   *  STEP 1 — HIDE ALL RELATED ITEMS
   * ------------------------------- */
  initializeRootVisibility() {
    const relatedIds = new Set<number>();
    this.allOptions.forEach((o) => o.relatedIds.forEach((id) => relatedIds.add(id)));

    // show only root items
    this.visibleOptions = this.allOptions.filter((o) => !relatedIds.has(o.id));
  }

  /** Add already-active related items (from restored state) */
  appendActiveChildren() {
    this.activeRelated.forEach((id) => {
      const child = this.allOptions.find((o) => o.id === id);
      if (child && !this.visibleOptions.some((v) => v.id === child.id)) {
        this.visibleOptions.push(child);
      }
    });
  }

  /** -------------------------------
   *  ON USER TOGGLE
   * ------------------------------- */
  onToggle(option: OptionItem) {
    if (option.model) {
      this.handleSelect(option);
    } else {
      this.handleUnselect(option);
    }
  }

  /** SELECT */
  handleSelect(option: OptionItem) {
    if (!this.selectedOptions.some((o) => o.id === option.id)) {
      this.selectedOptions.push(option);
    }

    this.workflow.setSelectedStyleOptions([...this.selectedOptions]);

    // hide other items in the same category
    this.visibleOptions = this.visibleOptions.filter(
      (o) => o.categoryId !== option.categoryId || o.id === option.id
    );

    console.log('Related IDs to show:', option.relatedIds);
    // show related children
    option.relatedIds.forEach((id) => this.activeRelated.add(id));
    console.log('Active related IDs:', Array.from(this.activeRelated));
    this.refreshVisible();
  }

  /** UNSELECT */
  handleUnselect(option: OptionItem) {
    option.model = false;

    this.selectedOptions = this.selectedOptions.filter((o) => o.id !== option.id);
    this.workflow.setSelectedStyleOptions([...this.selectedOptions]);

    option.relatedIds.forEach((id) => this.activeRelated.delete(id));

    const categoryStillSelected = this.selectedOptions.some(
      (o) => o.categoryId === option.categoryId
    );

    // if the category has no selected item → restore root options in that category
    if (!categoryStillSelected) {
      const categoryOptions = this.allOptions.filter((o) => o.categoryId === option.categoryId);
      categoryOptions.forEach((o) => {
        if (!this.visibleOptions.some((v) => v.id === o.id)) {
          this.visibleOptions.push(o);
        }
      });
    }

    this.refreshVisible();
  }

  /** -------------------------------
   *  FINAL VISIBILITY FILTER
   * ------------------------------- */
  refreshVisible() {
    const allowedIds = new Set<number>();

    /** 1. Build full set of IDs that are related children anywhere */
    const globalRelatedIds = new Set<number>();
    this.allOptions.forEach((o) => o.relatedIds.forEach((id) => globalRelatedIds.add(id)));

    /** 2. Add selected parent items */
    this.selectedOptions.forEach((o) => allowedIds.add(o.id));

    /** 3. Add only active related children */
    this.activeRelated.forEach((id) => allowedIds.add(id));

    /** 4. Add ROOT items ONLY from categories with no selected parent */
    this.allOptions.forEach((opt) => {
      const categoryHasSelected = this.selectedOptions.some((s) => s.categoryId === opt.categoryId);

      const isRoot = !globalRelatedIds.has(opt.id);
      const isActiveChild = this.activeRelated.has(opt.id);

      if (!categoryHasSelected && isRoot && !isActiveChild) {
        allowedIds.add(opt.id);
      }
    });

    /** 5. Final filter */
    this.visibleOptions = this.allOptions.filter((o) => allowedIds.has(o.id));
  }

  /** Chip remove */
  unselectByChip(opt: OptionItem) {
    const real = this.allOptions.find((o) => o.id === opt.id);
    if (real) {
      real.model = false;
      this.handleUnselect(real);
    }
  }
}
