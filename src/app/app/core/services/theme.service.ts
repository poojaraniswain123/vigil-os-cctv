import { Injectable, signal, effect, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type Theme = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Signal holds our current theme. Default is 'dark'.
  themeSignal = signal<Theme>('dark');

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.initializeTheme();

    // The effect automatically runs whenever themeSignal changes
    effect(() => {
      const currentTheme = this.themeSignal();
      // Update HTML attribute for CSS variables
      this.document.documentElement.setAttribute('data-theme', currentTheme);
      // Persist to localStorage
      localStorage.setItem('vigil_os_theme', currentTheme);
    });
  }

  private initializeTheme(): void {
    const savedTheme = localStorage.getItem('vigil_os_theme') as Theme;
    if (savedTheme) {
      this.themeSignal.set(savedTheme);
    } else {
      // Check system preference fallback
      const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
      this.themeSignal.set(prefersLight ? 'light' : 'dark');
    }
  }

  toggleTheme(): void {
    this.themeSignal.update(current => current === 'dark' ? 'light' : 'dark');
  }
}