import { Component } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ClientDetailsService } from '../client-details.service';

@Component({
  selector: 'app-dashboard-stats',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './dashboard-stats.component.html',
  styleUrl: './dashboard-stats.component.css'
})
export class DashboardStatsComponent {
  constructor(public clientDetailsService: ClientDetailsService) {}
}
