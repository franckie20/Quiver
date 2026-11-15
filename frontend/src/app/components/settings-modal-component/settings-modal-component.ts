import { Component, ElementRef, effect, inject, input, output, viewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '@services/notification-service';

@Component({
  selector: 'app-settings-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <dialog #dialogEl class="modal" (close)="closed.emit()">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">Quiver Profile & Settings</h3>
        <p class="py-2 text-sm opacity-75">
          Manage your store preferences and profile details here.
        </p>
        <div class="modal-action">
          <button type="button" class="btn" (click)="close()">Close</button>
          <button type="button" class="btn btn-primary" (click)="save()">Save Changes</button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  `,
})
export class SettingsModalComponent {
  readonly isOpen = input.required<boolean>();
  readonly closed = output<void>();

  private readonly dialogEl = viewChild.required<ElementRef<HTMLDialogElement>>('dialogEl');
  private readonly notifications = inject(NotificationService);

  constructor() {
    effect(() => {
      const el = this.dialogEl().nativeElement;
      if (this.isOpen() && !el.open) {
        el.showModal();
      } else if (!this.isOpen() && el.open) {
        el.close();
      }
    });
  }

  close(): void {
    this.closed.emit();
  }

  save(): void {
    this.notifications.show('Settings saved successfully!');
    this.closed.emit();
  }
}
