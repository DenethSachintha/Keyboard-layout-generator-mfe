import { Component, signal } from '@angular/core';
import { ImportsModule } from './imports';
import { PrimeNG } from 'primeng/config';
import { Workflow } from "./pages/workflow/workflow";

@Component({
  selector: 'app-root',
  imports: [ImportsModule, Workflow],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Keyboard-layout-generator-mfe');
    constructor(private primeng: PrimeNG) {}

    ngOnInit() {
        this.primeng.ripple.set(true);
    }
}
