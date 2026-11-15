import { computed, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CatalogService } from '@api/api/catalog.service';
import { UserSettingsService } from '@api/api/userSettings.service';
import { UserSettings } from '@api/model/userSettings';
import { Product } from '@api/model/product';
import { UserSettingsInput } from '@api/model/userSettingsInput';
import { NotificationService } from '@services/notification-service';
import { WishlistProductItem } from '@models/quiver.models';

@Injectable({
  providedIn: 'root',
})
export class StoreStateService {
  private readonly notifications = inject(NotificationService);
  private readonly catalogService = inject(CatalogService);
  private readonly userSettingsService = inject(UserSettingsService);

  private readonly _products$ = this.catalogService.getAllProducts();
  private storageKey = 'quiver_user_uuid';

  readonly userUuid = this.getOrCreateUuid();

  // Centrale state op basis van UserSettings met wishlistItems (productId + quantity)
  private readonly _userSettings = signal<UserSettings>({
    uuid: this.userUuid,
    name: 'Elena Rostova',
    wishlistItems: [],
  });

  readonly products = toSignal(this._products$, { initialValue: [] as Product[] });
  readonly userSettings = this._userSettings.asReadonly();

  readonly userName = computed(() => this._userSettings().name ?? '');
  readonly rawWishlistItems = computed(() => this._userSettings().wishlistItems ?? []);

  /**
   * Combineert de opgeslagen wishlist-items (ID + quantity) met de echte Product objecten uit de catalogus.
   */
  readonly wishlistItems = computed<WishlistProductItem[]>(() => {
    const allProducts = this.products();
    const items = this.rawWishlistItems();

    return items
      .map((item) => {
        const product = allProducts.find((p) => p.id === item.productId);
        return product ? { product, quantity: item.quantity } : null;
      })
      .filter((item): item is WishlistProductItem => item !== null);
  });

  readonly wishlistCount = computed(() =>
    this.rawWishlistItems().reduce((sum, item) => sum + item.quantity, 0),
  );

  readonly userInitials = computed(() =>
    this.userName()
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2),
  );

  constructor() {
    this.loadUserSettings();
  }

  public getOrCreateUuid(): string {
    let uuid = localStorage.getItem(this.storageKey);
    if (!uuid) {
      uuid = crypto.randomUUID();
      localStorage.setItem(this.storageKey, uuid);
    }
    return uuid;
  }

  public loadUserSettings(): void {
    this.userSettingsService.getUserSettings(this.userUuid).subscribe({
      next: (settings: UserSettings) => {
        if (settings) {
          this._userSettings.set({
            uuid: this.userUuid,
            name: settings.name ?? 'Elena Rostova',
            wishlistItems: settings.wishlistItems ?? [],
          });
        }
      },
      error: (err) => {
        if (err.status === 404) {
          console.log('Geen eerdere instellingen gevonden.');
        } else {
          console.error('Fout bij ophalen user settings:', err);
        }
      },
    });
  }

  /**
   * Voeg een product toe of verhoog de hoeveelheid als het al in de wishlist staat
   */
  addToWishlist(product: Product, amount: number = 1): void {
    if (product.id == null || product.stock == null || product.stock <= 0) return;

    const currentItems = [...this.rawWishlistItems()];
    const existingIndex = currentItems.findIndex((item) => item.productId === product.id);

    if (existingIndex > -1) {
      currentItems[existingIndex] = {
        ...currentItems[existingIndex],
        quantity: currentItems[existingIndex].quantity + amount,
      };
    } else {
      currentItems.push({ productId: product.id, quantity: amount });
    }

    this.updateSettingsState({ wishlistItems: currentItems });
    this.notifications.show(`Updated ${product.title} quantity in wishlist`);
  }

  increaseWishlistQuantity(productId: number | undefined): void {
    if (productId == null) return;

    const currentItems = [...this.rawWishlistItems()];
    const existingIndex = currentItems.findIndex((item) => item.productId === productId);

    if (existingIndex > -1) {
      currentItems[existingIndex] = {
        ...currentItems[existingIndex],
        quantity: currentItems[existingIndex].quantity + 1,
      };
      this.updateSettingsState({ wishlistItems: currentItems });
    }
  }

  /**
   * Verlaag de hoeveelheid of verwijder het item volledig als quantity 0 bereikt
   */
  decreaseWishlistQuantity(productId: number | undefined): void {
    if (productId == null) return;

    const currentItems = [...this.rawWishlistItems()];
    const existingIndex = currentItems.findIndex((item) => item.productId === productId);

    if (existingIndex > -1) {
      const currentQty = currentItems[existingIndex].quantity;
      if (currentQty > 1) {
        currentItems[existingIndex] = {
          ...currentItems[existingIndex],
          quantity: currentQty - 1,
        };
      } else {
        currentItems.splice(existingIndex, 1);
      }
      this.updateSettingsState({ wishlistItems: currentItems });
    }
  }

  removeFromWishlist(productId: number | undefined) {
    if (productId == null) return;

    const updatedItems = this.rawWishlistItems().filter((item) => item.productId !== productId);
    this.updateSettingsState({ wishlistItems: updatedItems });
    this.notifications.show('Removed item from wishlist');
  }

  clearWishlist(): void {
    this.updateSettingsState({ wishlistItems: [] });
    this.notifications.show('Wishlist cleared');
  }

  updateUserName(name: string): void {
    this.updateSettingsState({ name });
    this.notifications.show('Profile settings saved');
  }

  private updateSettingsState(partial: Partial<UserSettings>): void {
    this._userSettings.update((current) => ({
      ...current,
      ...partial,
    }));
    this.syncToBackend();
  }

  private syncToBackend(): void {
    const current = this._userSettings();
    const payload: UserSettingsInput = {
      name: current.name,
      wishlistItems: current.wishlistItems,
    };

    this.userSettingsService.saveUserSettings(this.userUuid, payload).subscribe({
      error: (err) => console.error('Fout bij synchroniseren met backend:', err),
    });
  }
}
