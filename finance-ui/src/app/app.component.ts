import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingService } from './api';
@Component({
  selector: 'app-root', standalone: true, imports: [RouterOutlet],
  template: `
    <router-outlet />
    @if (loading.isLoading()) {
      <div class="loading-overlay" role="status" aria-live="polite" aria-label="Loading">
        <span class="loading-spinner" aria-hidden="true"></span>
        <span>Loading...</span>
      </div>
    }
  `,
  styleUrls: ['./global.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  constructor(readonly loading: LoadingService) {}
}