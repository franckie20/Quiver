import { DOCUMENT } from '@angular/common';
import { Injectable, RendererFactory2, effect, inject, signal } from '@angular/core';
import { ThemeName, ThemeOption } from '../models/quiver.models';
import { NotificationService } from './notification-service';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly renderer = inject(RendererFactory2).createRenderer(null, null);
  private readonly notifications = inject(NotificationService);

  readonly availableThemes: readonly ThemeOption[] = [
    { id: 'light', label: 'Light', icon: '☀️' },
    { id: 'dark', label: 'Dark', icon: '🌙' }
  ];

  private readonly _currentTheme = signal<ThemeName>('light');
  readonly currentTheme = this._currentTheme.asReadonly();

  constructor() {
    effect(() => {
      this.renderer.setAttribute(this.document.documentElement, 'data-theme', this._currentTheme());
    });
  }

  setTheme(theme: ThemeName): void {
    if (this._currentTheme() === theme) return;
    this._currentTheme.set(theme);
    const label = theme.charAt(0).toUpperCase() + theme.slice(1);
    this.notifications.show(`Switched theme to ${label}`);
  }
}
