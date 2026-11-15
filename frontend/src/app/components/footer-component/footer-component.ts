import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer
      class="footer footer-center p-8 bg-base-100 text-base-content border-t border-base-300 mt-12"
    >
      <aside>
        <div class="flex items-center gap-2 font-bold text-lg">
          <span
            class="w-6 h-6 rounded bg-primary text-primary-content flex items-center justify-center text-xs"
            >Q</span
          >
          <span>Quiver</span>
        </div>
        <p class="opacity-75 text-sm mt-1">Crafted with Angular, Tailwind CSS, and DaisyUI</p>
        <p class="text-xs opacity-60">Copyright © 2026 Quiver - All rights reserved</p>
      </aside>
      <nav>
        <div class="grid grid-flow-col gap-4 text-sm font-medium">
          <a (click)="navigateToProducts.emit()" class="link link-hover">Products</a>
          <a (click)="openSettings.emit()" class="link link-hover">Settings</a>
        </div>
      </nav>
    </footer>
  `,
})
export class FooterComponent {
  readonly navigateToProducts = output<void>();
  readonly openSettings = output<void>();
}
