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

  // Storage keys
  private readonly STORAGE_KEY_UUID = 'quiver_user_uuid';
  private readonly STORAGE_KEY_USERNAME = 'quiver_user_name';

  // Identificatie
  readonly userUuid = this.getOrCreateUuid();
  readonly username = this.getOrCreateUsername();

  // Externe API data (Products)
  private readonly _products$ = this.catalogService.getAllProducts();
  readonly products = toSignal(this._products$, { initialValue: [] as Product[] });

  // Centrale state (Source of Truth)
  private readonly _userSettings = signal<UserSettings>({
    uuid: this.userUuid,
    name: this.username,
    wishlistItems: [],
  });
  readonly userSettings = this._userSettings.asReadonly();

  // --- COMPUTED PROPERTIES ---
  readonly userName = computed(() => this._userSettings().name ?? '');
  readonly rawWishlistItems = computed(() => this._userSettings().wishlistItems ?? []);

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

  readonly wishlistCount = computed(() => this.rawWishlistItems().length);

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

  // --- LOCALSTORAGE & IDENTITY INITIALIZATION ---
  public getOrCreateUuid(): string {
    let uuid = localStorage.getItem(this.STORAGE_KEY_UUID);
    if (!uuid) {
      uuid = crypto.randomUUID();
      localStorage.setItem(this.STORAGE_KEY_UUID, uuid);
    }
    return uuid;
  }

  public getOrCreateUsername(): string {
    let username = localStorage.getItem(this.STORAGE_KEY_USERNAME);
    if (!username) {
      username = this.generateRandomName();
      localStorage.setItem(this.STORAGE_KEY_USERNAME, username);
    }
    return username;
  }

  private generateRandomName(): string {
    const adjectives = ['Swift', 'Cosmic', 'Silent', 'Brave', 'Clever', 'Neon', 'Wild', 'Bold'];
    const nouns = ['Panda', 'Tiger', 'Falcon', 'Badger', 'Otter', 'Wolf', 'Phoenix', 'Ninja'];

    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNumber = Math.floor(Math.random() * 90) + 10;

    return `${randomAdj}${randomNoun}${randomNumber}`;
  }

  // --- BACKEND SYNC & LOADING ---
  public loadUserSettings(): void {
    this.userSettingsService.getUserSettings(this.userUuid).subscribe({
      next: (settings: UserSettings) => {
        if (settings) {
          this._userSettings.set({
            uuid: this.userUuid,
            name: settings.name ?? this.username,
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

  private syncTimeoutId: ReturnType<typeof setTimeout> | null = null;

  private updateSettingsState(partial: Partial<UserSettings>): void {
    // 1. Update de lokale signal direct
    this._userSettings.update((current) => ({
      ...current,
      ...partial,
    }));

    // 2. Annuleer de vorige timer als er binnen de tijd weer iets wijzigt
    if (this.syncTimeoutId) {
      clearTimeout(this.syncTimeoutId);
    }

    // 3. Start een nieuwe timer: pas na 400ms stilte sturen we alles naar de backend
    this.syncTimeoutId = setTimeout(() => this.syncToBackend(), 400);
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

  // --- USER PROFILE ACTIONS ---
  updateUserName(name: string): void {
    localStorage.setItem(this.STORAGE_KEY_USERNAME, name); // Ook lokaal bijwerken
    this.updateSettingsState({ name });
    this.notifications.show('Profile settings saved');
  }

  // --- WISHLIST ACTIONS ---
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

  increaseWishlistQuantity(productId: number | undefined, amount: number = 1): void {
    if (productId == null) return;

    const currentItems = [...this.rawWishlistItems()];
    const existingIndex = currentItems.findIndex((item) => item.productId === productId);

    if (existingIndex > -1) {
      currentItems[existingIndex] = {
        ...currentItems[existingIndex],
        quantity: currentItems[existingIndex].quantity + amount, // Verhoog met de opgegeven amount (default = 1)
      };
      this.updateSettingsState({ wishlistItems: currentItems });
    }
  }

  decreaseWishlistQuantity(productId: number | undefined, amount: number = 1): void {
    if (productId == null) return;

    const currentItems = [...this.rawWishlistItems()];
    const existingIndex = currentItems.findIndex((item) => item.productId === productId);

    if (existingIndex > -1) {
      const currentQty = currentItems[existingIndex].quantity;

      if (currentQty > amount) {
        currentItems[existingIndex] = {
          ...currentItems[existingIndex],
          quantity: currentQty - amount,
        };
      } else {
        // Als de nieuwe hoeveelheid 0 of lager wordt, verwijderen we het item
        currentItems.splice(existingIndex, 1);
      }
      this.updateSettingsState({ wishlistItems: currentItems });
    }
  }

  removeFromWishlist(productId: number | undefined): void {
    if (productId == null) return;

    const updatedItems = this.rawWishlistItems().filter((item) => item.productId !== productId);
    this.updateSettingsState({ wishlistItems: updatedItems });
    this.notifications.show('Removed item from wishlist');
  }

  clearWishlist(): void {
    this.updateSettingsState({ wishlistItems: [] });
    this.notifications.show('Wishlist cleared');
  }
}
