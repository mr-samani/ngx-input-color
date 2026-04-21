import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BrowserService {
  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  get prefersDarkMode(): boolean {
    if (!this.isBrowser) return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}
