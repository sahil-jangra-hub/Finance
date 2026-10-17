import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard-stats',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './dashboard-stats.component.html',
  styleUrl: './dashboard-stats.component.css'
})
export class DashboardStatsComponent {
  @Input() lent = 0;
  @Input() receivable = 0;
  @Input() overdue = 0;
  @Input() clientCount = 0;
}
