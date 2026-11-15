import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { StoreStateService } from '@services/store-state-service';
import { ProductCardComponent } from '../product-card-component/product-card-component';

@Component({
  selector: 'app-product-catalog',
  imports: [ProductCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="products" class="container mx-auto px-4 py-10 max-w-7xl">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight">Catalog</h1>
          <p class="text-sm opacity-70 mt-1">Explore the latest gear curated by Quiver</p>
        </div>
        <span class="badge badge-outline badge-lg">{{ store.products()?.length }} Products</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (product of store.products(); track product.id) {
          <app-product-card [product]="product" (addToCart)="store.addToCart($event)" />
        }
      </div>
    </section>
  `,
})
export class ProductCatalogComponent {
  protected readonly store = inject(StoreStateService);
}
