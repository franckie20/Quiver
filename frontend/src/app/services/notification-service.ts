import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly _message = signal<string | null>(null);
  private dismissTimer: ReturnType<typeof setTimeout> | null = null;

  readonly message = this._message.asReadonly();

  show(message: string, durationMs = 2600): void {
    this._message.set(message);

    if (this.dismissTimer) {
      clearTimeout(this.dismissTimer);
    }

    this.dismissTimer = setTimeout(() => this._message.set(null), durationMs);
  }
}
