import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'componenets', pathMatch: 'full' },
  { path: 'demo', loadComponent: () => import('./demo-page/demo-page.component').then((c) => c.DemoPageComponent) },
  {
    path: 'componenets',
    loadComponent: () => import('./components/components.component').then((c) => c.ComponentsComponent),
  },
  { path: '**', redirectTo: 'componenets' },
];
