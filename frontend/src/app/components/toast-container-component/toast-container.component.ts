import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NotificationService } from '@services/notification-service';

@Component({
  selector: 'app-toast-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (notifications.message(); as message) {
      <div class="toast toast-end toast-bottom z-50">
        <div class="alert alert-success shadow-lg border border-success/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-current shrink-0 h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span class="text-sm font-medium">{{ message }}</span>
        </div>
      </div>
    }
  `,
})
export class ToastContainerComponent {
  protected readonly notifications = inject(NotificationService);
}
