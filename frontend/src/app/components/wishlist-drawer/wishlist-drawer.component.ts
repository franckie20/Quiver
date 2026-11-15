import { Component, input, output } from '@angular/core';
import { Product } from '@api/model/product';
import { LucideTrash } from '@lucide/angular';

@Component({
  imports: [LucideTrash],
  selector: 'app-wishlist-drawer',
  template: `
    <div class="drawer drawer-end z-50">
      <input
        id="cart-drawer"
        type="checkbox"
        class="drawer-toggle"
        [checked]="isOpen()"
        (change)="onToggle($event)"
      />

      <div class="drawer-content"></div>
      <div class="drawer-side">
        <label for="cart-drawer" aria-label="close sidebar" class="drawer-overlay"></label>

        <div
          class="menu bg-base-200 text-base-content min-h-full w-80 p-4 flex flex-col justify-between shadow-2xl"
        >
          <div>
            <h2 class="text-xl font-bold mb-4 flex items-center justify-between">
              <span>Wishlist</span>
              <span class="badge badge-primary">{{ items().length }}</span>
            </h2>

            @if (items().length > 0) {
              <ul class="space-y-3">
                @for (product of items(); track product.id) {
                  <li
                    class="flex items-center gap-3 bg-base-100 p-2 rounded-box shadow-sm relative group"
                  >
                    <div class="flex-1 min-w-0">
                      <p class="font-semibold text-sm truncate">{{ product.title }}</p>
                      <p class="text-xs text-base-content/70">
                        {{ product.currency }} {{ product.price }}
                      </p>

                      <!-- Delete -->
                      <button
                        type="button"
                        class="btn btn-ghost btn-sm btn-circle text-error hover:bg-error/20"
                        (click)="onRemove(product.id, $event)"
                        title="Verwijder uit wishlist"
                      >
                        <svg lucideTrash class="w-6 h-6"></svg>
                      </button>
                    </div>
                  </li>
                }
              </ul>
            } @else {
              <div class="text-center py-8 text-base-content/60">
                <p>Je wishlist is nog leeg.</p>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class WishlistDrawerComponent {
  readonly isOpen = input<boolean>(false);
  readonly items = input<readonly Product[]>([]);
  readonly closed = output<void>();
  readonly removed = output<number | undefined>();

  public onToggle(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (!isChecked) {
      this.closed.emit();
    }
  }

  public onRemove(productId: number | undefined, event: Event) {
    event.stopPropagation(); // prevent li-clicks from bubbling
    this.removed.emit(productId);
  }
}
