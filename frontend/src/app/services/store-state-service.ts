import { Injectable, computed, inject, signal } from '@angular/core';
import { Product, UserProfile } from '@models/quiver.models';
import { NotificationService } from '@services/notification-service';

@Injectable({ providedIn: 'root' })
export class StoreStateService {
  private readonly notifications = inject(NotificationService);

  private readonly _products = signal<readonly Product[]>([
    {
      id: 1,
      name: 'Quiver Field Pack 24L',
      category: 'Carry',
      price: 165,
      badge: 'New',
      description:
        'Weatherproof daily carry engineered with modular internal organization and ballistic nylon.',
      inStock: true,
    },
    {
      id: 2,
      name: 'Carbon Desk Organizer',
      category: 'Workspace',
      price: 78,
      description:
        'Minimalist anodized aluminum tray system to keep everyday essentials within reach.',
      inStock: true,
    },
    {
      id: 3,
      name: 'Aero Insulated Flask',
      category: 'Hydration',
      price: 42,
      badge: 'Popular',
      description:
        'Double-wall vacuum insulated stainless steel flask with a leak-proof magnetic cap.',
      inStock: true,
    },
  ]);

  private readonly _cartItems = signal<readonly Product[]>([]);

  private readonly _profile = signal<UserProfile>({
    name: 'Elena Rostova',
    role: 'Quiver Member',
    availability: 'Available',
  });

  readonly products = this._products.asReadonly();
  readonly profile = this._profile.asReadonly();
  readonly cartCount = computed(() => this._cartItems().length);

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
    if (!product.inStock) return;
    this._cartItems.update((items) => [...items, product]);
    this.notifications.show(`Added ${product.name} to cart`);
  }

  clearCart(): void {
    this._cartItems.set([]);
    this.notifications.show('Cart cleared');
  }

  inspectCart(): void {
    const count = this.cartCount();
    this.notifications.show(`${count} item(s) in your Quiver cart`);
  }

  updateProfile(updated: UserProfile): void {
    this._profile.set(updated);
    this.notifications.show('Profile settings saved');
  }
}
