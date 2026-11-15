import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Product } from '@api/model/product';

@Component({
  selector: 'app-product-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="card bg-base-100 shadow-md hover:shadow-xl transition-shadow border border-base-300 h-full"
    >
      <figure class="h-48 bg-base-300/50 flex items-center justify-center relative">
        <span class="text-4xl font-black tracking-tighter opacity-20 select-none">QUIVER</span>
      </figure>
      <div class="card-body">
        <div class="flex items-center justify-between text-xs opacity-70">
          <span class="uppercase tracking-wider font-semibold">{{ product().category }}</span>
        </div>
        <h2 class="card-title text-lg font-bold mt-1">{{ product().title }}</h2>
        <p class="text-sm opacity-80 line-clamp-2">{{ product().brand }}</p>
        <div class="card-actions items-center justify-between mt-4 pt-4 border-t border-base-200">
          <span class="text-xl font-extrabold text-primary">\${{ product().price }}</span>
          <button
            type="button"
            [disabled]="product().stock === 0"
            (click)="addToCart.emit(product())"
            class="btn btn-primary btn-sm"
          >
            {{ product().stock !== 0 ? 'Add to Cart' : 'Unavailable' }}
          </button>
        </div>
      </div>
    </article>
  `,
})
export class ProductCardComponent {
  readonly product = input.required<Product>();
  readonly addToCart = output<Product>();
}
