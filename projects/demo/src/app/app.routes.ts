import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'color-picker', pathMatch: 'full' },
  {
    path: 'color-picker',
    loadComponent: () => import('./color-picker/color-picker.component').then((c) => c.ColorPickerComponent),
  },
  {
    path: 'gradient-picker',
    loadComponent: () => import('./gradient-picker/gradient-picker.component').then((c) => c.GradientPickerComponent),
  },
  {
    path: 'box-shadow',
    loadComponent: () => import('./box-shadow/box-shadow.component').then((c) => c.BoxShadowComponent),
  },
];
