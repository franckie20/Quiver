import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { StoreStateService } from '@services/store-state-service';
import { ThemeService } from '@services/theme-service';
import { LucideStar } from '@lucide/angular';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header
      class="navbar bg-base-100/90 backdrop-blur-md sticky top-0 z-40 border-b border-base-300 px-4 lg:px-8 shadow-sm"
    >
      <div class="navbar-start">
        <div class="dropdown">
          <div tabindex="0" role="button" class="btn btn-ghost lg:hidden" aria-label="Open menu">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabindex="0"
            class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 border border-base-300"
          >
            <li><a (click)="navigateToProducts.emit()">Products</a></li>
            <li><a (click)="openSettings.emit()">Settings</a></li>
          </ul>
        </div>
        <a
          (click)="navigateToProducts.emit()"
          class="btn btn-ghost text-xl font-bold tracking-tight gap-2 px-2"
        >
          <span
            class="w-8 h-8 rounded-lg bg-primary text-primary-content flex items-center justify-center shadow-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
          <span>Quiver</span>
        </a>
      </div>

      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1 font-medium gap-1">
          <li><a (click)="navigateToProducts.emit()" class="rounded-lg">Products</a></li>
          <li><a (click)="openSettings.emit()" class="rounded-lg">Account</a></li>
        </ul>
      </div>

      <div class="navbar-end gap-4">
        <!-- Wishlist Indicator -->
        <div class="indicator">
          <button
            type="button"
            (click)="store.inspectWishlist();toggleWishlist.emit()"
            class="btn btn-ghost btn-circle"
            aria-label="Wishlist"
          >
            <svg lucideStar class="w-6 h-6"></svg>
            @if (store.wishlistCount() > 0) {
              <span class="badge badge-xs badge-primary indicator-item">
                {{ store.wishlistCount() }}
              </span>
            }
          </button>
        </div>
        <!-- Theme Switcher -->
        <div class="dropdown dropdown-end">
          <div
            tabindex="0"
            role="button"
            class="btn btn-ghost btn-sm md:btn-md gap-2 border border-base-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
              />
            </svg>
            <span class="capitalize hidden sm:inline">{{ themeService.currentTheme() }}</span>
            <svg
              width="12px"
              height="12px"
              class="h-2 w-2 fill-current opacity-60 inline-block"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 2048 2048"
            >
              <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
            </svg>
          </div>
          <ul
            tabindex="0"
            class="dropdown-content z-[50] p-2 shadow-2xl bg-base-100 rounded-box w-48 border border-base-300 mt-2 space-y-1"
          >
            @for (theme of themeService.availableThemes; track theme.id) {
              <li>
                <button
                  type="button"
                  (click)="themeService.setTheme(theme.id)"
                  class="btn btn-sm btn-block justify-between font-medium"
                  [class.btn-primary]="themeService.currentTheme() === theme.id"
                  [class.btn-ghost]="themeService.currentTheme() !== theme.id"
                >
                  <span class="flex items-center gap-2">
                    <span>{{ theme.icon }}</span>
                    <span>{{ theme.label }}</span>
                  </span>
                  @if (themeService.currentTheme() === theme.id) {
                    <span class="badge badge-xs badge-secondary">Active</span>
                  }
                </button>
              </li>
            }
          </ul>
        </div>

        <!-- Profile Avatar Dropdown -->
        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar online">
            <div
              class="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 bg-neutral text-neutral-content flex items-center justify-center font-bold"
            >
              <span class="text-sm leading-none flex items-center justify-center h-full">{{
                store.userInitials()
              }}</span>
            </div>
          </div>
          <ul
            tabindex="0"
            class="menu menu-sm dropdown-content mt-3 z-[50] p-2 shadow-xl bg-base-100 rounded-box w-56 border border-base-300"
          >
            <li class="menu-title px-4 py-2">
              <span class="text-base-content font-bold block">{{ store.profile().name }}</span>
              <span class="text-xs font-normal opacity-70">{{ store.profile().role }}</span>
            </li>
            <div class="divider my-0"></div>
            <li><a (click)="openSettings.emit()">Profile & Preferences</a></li>
            <li>
              <a (click)="store.clearWishlist()">Clear wishlist ({{ store.wishlistCount() }})</a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  `,
  imports: [LucideStar],
})
export class HeaderComponent {
  protected readonly store = inject(StoreStateService);
  protected readonly themeService = inject(ThemeService);

  readonly navigateToProducts = output<void>();
  readonly openSettings = output<void>();
  readonly toggleWishlist = output<void>();
}
