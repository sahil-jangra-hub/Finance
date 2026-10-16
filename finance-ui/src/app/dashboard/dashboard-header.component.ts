import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  template: `
    <header class="topbar">
      <div class="brand">💰 Finance Tracker</div>
      <div>👤 {{ name }} <button class="btn btn-ghost btn-sm" (click)="logout.emit()">Logout</button></div>
    </header>
  `
})
export class DashboardHeaderComponent {
  @Input() name: string | null = null;
  @Output() logout = new EventEmitter<void>();
}
