import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard-stats',
  standalone: true,
  imports: [DecimalPipe],
  template: `
    <section class="stats">
      <div class="stat"><small>Money lent (active)</small><b>₹{{ lent | number:'1.0-0' }}</b></div>
      <div class="stat green"><small>Total to receive</small><b>₹{{ receivable | number:'1.0-0' }}</b></div>
      <div class="stat red"><small>Overdue loans</small><b>{{ overdue }}</b></div>
      <div class="stat"><small>Clients</small><b>{{ clientCount }}</b></div>
    </section>
  `
})
export class DashboardStatsComponent {
  @Input() lent = 0;
  @Input() receivable = 0;
  @Input() overdue = 0;
  @Input() clientCount = 0;
}
