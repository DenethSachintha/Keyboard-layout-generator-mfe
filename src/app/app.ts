import { Component, signal } from '@angular/core';
import { ImportsModule } from './imports';
import { PrimeNG } from 'primeng/config';

@Component({
  selector: 'app-root',
  imports: [ImportsModule],
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
