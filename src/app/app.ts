import { Component } from '@angular/core';
import { ImportsModule } from './imports';
import { PrimeNG } from 'primeng/config';
import { RemoteStateService } from './services/remote-state.service';

@Component({
  selector: 'app-root',
  imports: [ImportsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
 SharedState: any = null;
  hostMessage: any = null;

  constructor(
    private remoteStateService: RemoteStateService,
    private primeng: PrimeNG
  ) {}

  async ngOnInit() {
    this.primeng.ripple.set(true);

    // Load StateService from host
    this.SharedState = await this.remoteStateService.init();

this.SharedState.layoutState$.subscribe((data: any) => {
  console.log("Remote received:", data);
  this.hostMessage = data;
});


    // Send update back to host
    setTimeout(() => {
      this.SharedState.updateState({ fromRemote: "Hello HOST! Remote updated." });
    }, 3000);
  }
}
