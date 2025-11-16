import { Routes } from '@angular/router';
import { App } from './app';
import { Workflow } from './pages/workflow/workflow';

export const routes: Routes = [
 { path: '', component: Workflow, pathMatch: 'full'}
];

