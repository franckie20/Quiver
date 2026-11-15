import { Component, computed, inject, signal } from '@angular/core';
import { HeaderComponent } from '@components/header-component/header-component';
import { FooterComponent } from '@components/footer-component/footer-component';
import { ProductCatalogComponent } from '@components/product-catalog-component/product-catalog-component';
import { SettingsModalComponent } from '@components/settings-modal-component/settings-modal-component';
import { ToastContainerComponent } from '@components/toast-container-component/toast-container.component';
import { WishlistDrawerComponent } from '@components/wishlist-drawer/wishlist-drawer.component';
import { StoreStateService } from '@services/store-state-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    ProductCatalogComponent,
    SettingsModalComponent,
    ToastContainerComponent,
    WishlistDrawerComponent,
  ],
  template: `
    <div class="min-h-screen flex flex-col bg-base-100 text-base-content relative">
      <!-- Header -->
      <app-header
        (openSettings)="isSettingsOpen.set(true)"
        (toggleWishlist)="isWishlistOpen.update((v) => !v)"
      />

      <!-- Main content (met de padding/container) -->
      <main class="flex-grow container mx-auto px-4 py-8">
        <app-product-catalog />
      </main>

      <app-footer />

      <!-- Modals & Toasts -->
      <app-settings-modal [isOpen]="isSettingsOpen()" (closed)="isSettingsOpen.set(false)" />
      <app-toast-container />
    </div>

    <app-wishlist-drawer
      [isOpen]="isWishlistOpen()"
      (closed)="isWishlistOpen.set(false)"
      (increased)="store.increaseWishlistQuantity($event)"
      (removed)="store.removeFromWishlist($event)"
      (decreased)="store.decreaseWishlistQuantity($event)"
      [items]="store.wishlistItems()"
    />
  `,
})
export class App {
  protected readonly store = inject(StoreStateService);

  readonly isSettingsOpen = signal(false);
  readonly isWishlistOpen = signal(false);
  protected readonly model = signal<boolean>(true);
}
