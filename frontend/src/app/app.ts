import { Component, signal } from '@angular/core';
import { HeaderComponent } from '@components/header-component/header-component';
import { FooterComponent } from '@components/footer-component/footer-component';
import { ProductCatalogComponent } from '@components/product-catalog-component/product-catalog-component';
import { SettingsModalComponent } from '@components/settings-modal-component/settings-modal-component';
import { ToastContainerComponent } from '@components/toast-container-component/toast-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    ProductCatalogComponent,
    SettingsModalComponent,
    ToastContainerComponent,
  ],
  template: `
    <div class="min-h-screen flex flex-col bg-base-100 text-base-content">
      <app-header (openSettings)="isSettingsOpen.set(true)" />

      <main class="flex-grow container mx-auto px-4 py-8">
        <app-product-catalog />
      </main>

      <app-footer />

      <app-settings-modal [isOpen]="isSettingsOpen()" (closed)="isSettingsOpen.set(false)" />

      <app-toast-container />
    </div>
  `,
})
export class App {
  readonly isSettingsOpen = signal(false);
}
