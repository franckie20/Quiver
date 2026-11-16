import { Component, ElementRef, effect, inject, input, output, viewChild } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '@services/notification-service';
import { UserSettingsInput } from '@api/model/userSettingsInput';

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

        <form [formGroup]="form" class="py-4 space-y-4">
          <fieldset class="fieldset">
            <legend class="fieldset-legend font-medium">Display Name</legend>
            <input
              type="text"
              formControlName="name"
              class="input input-bordered w-full"
              placeholder="Enter your name"
            />
          </fieldset>
        </form>

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

  // Ontvangt de huidige instellingen (inclusief naam én eventuele wishlistItems)
  readonly initialSettings = input<UserSettingsInput>({});

  // Geeft de gecombineerde data weer terug bij opslaan
  readonly saved = output<string>();
  readonly closed = output<void>();

  private readonly dialogEl = viewChild.required<ElementRef<HTMLDialogElement>>('dialogEl');
  private readonly notifications = inject(NotificationService);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
  });

  constructor() {
    effect(() => {
      const el = this.dialogEl().nativeElement;
      if (this.isOpen() && !el.open) {
        // Patch alleen de naam, maar behoud de structuur
        const settings = this.initialSettings();
        this.form.patchValue({
          name: settings.name ?? '',
        });
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
    if (this.form.invalid) {
      this.notifications.show('Please enter a valid name.');
      return;
    }

    const newName = this.form.getRawValue().name;

    // Emit alleen de naam, precies wat je store nodig heeft!
    this.saved.emit(newName);

    this.notifications.show('Settings saved successfully!');
    this.closed.emit();
  }
}
