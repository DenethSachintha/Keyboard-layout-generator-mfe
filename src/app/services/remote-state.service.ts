import { Injectable } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/native-federation';

@Injectable({ providedIn: 'root' })
export class RemoteStateService {


  async init() {
  const module = await loadRemoteModule({
    remoteName: 'Keyboard-layout-host-mfe',
    remoteEntry: 'http://localhost:4200/remoteEntry.js',
    exposedModule: './StateServiceInstance'
  });

  // This is the shared instance
  return module.stateServiceInstance;
}


}