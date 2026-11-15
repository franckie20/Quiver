import { Injectable, computed, inject, signal } from '@angular/core';
import { NotificationService } from '@services/notification-service';
import { CatalogService } from '@api/api/catalog.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Product } from '@api/model/product';
import { UserProfile } from '@models/quiver.models';

@Injectable({ providedIn: 'root' })
export class StoreStateService {
  private readonly notifications = inject(NotificationService);
  private readonly catalogService = inject(CatalogService);

  private readonly _products$ = this.catalogService.getAllProducts();

  private readonly _wishlistItems = signal<readonly Product[]>([]);

  private readonly _profile = signal<UserProfile>({
    name: 'Elena Rostova',
    role: 'Quiver Member',
    availability: 'Available',
  });

  readonly products = toSignal(this._products$);
  readonly profile = this._profile.asReadonly();
  readonly wishlistCount = computed(() => this._wishlistItems().length);

  readonly userInitials = computed(() =>
    this._profile()
      .name.split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2),
  );

  addToCart(product: Product): void {
    if (product.stock == null || product.stock <= 0) return;
    this._wishlistItems.update((items) => [...items, product]);
    this.notifications.show(`Added ${product.title} to cart`);
  }

  clearCart(): void {
    this._wishlistItems.set([]);
    this.notifications.show('Cart cleared');
  }

  inspectCart(): void {
    const count = this.wishlistCount();
    this.notifications.show(`${count} item(s) in your Quiver cart`);
  }

  updateProfile(updated: UserProfile): void {
    this._profile.set(updated);
    this.notifications.show('Profile settings saved');
  }
}
