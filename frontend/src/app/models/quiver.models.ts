import { Product } from '@api/model/product';

export type ThemeName = 'light' | 'dark' | 'cupcake' | 'synthwave';

export interface ThemeOption {
  readonly id: ThemeName;
  readonly label: string;
  readonly icon: string;
}

export interface WishlistProductItem {
  product: Product;
  quantity: number;
}
