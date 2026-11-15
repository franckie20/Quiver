export type ThemeName = 'light' | 'dark' | 'cupcake' | 'synthwave';

export interface ThemeOption {
  readonly id: ThemeName;
  readonly label: string;
  readonly icon: string;
}

export interface Product {
  readonly id: number;
  readonly name: string;
  readonly category: string;
  readonly price: number;
  readonly badge?: string;
  readonly description: string;
  readonly inStock: boolean;
}

export type AvailabilityStatus = 'Available' | 'In Deep Focus' | 'In a Meeting';

export interface UserProfile {
  readonly name: string;
  readonly role: string;
  readonly availability: AvailabilityStatus;
}
