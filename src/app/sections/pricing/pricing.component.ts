import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.scss'
})
export class PricingComponent {
  // Signal to toggle between billing cycles
  isAnnual = signal<boolean>(false);

  plans = [
    {
      name: 'BASE_NODE',
      desc: 'Essential surveillance for small perimeters.',
      priceMonthly: 199,
      priceAnnual: 1990,
      recommended: false,
      features: ['Up to 10 Camera Feeds', '7-Day Cloud Archive', 'Standard Motion Alerts', 'Basic Support']
    },
    {
      name: 'PRO_MESH',
      desc: 'Advanced AI analytics for mid-size networks.',
      priceMonthly: 499,
      priceAnnual: 4990,
      recommended: true,
      features: ['Up to 50 Camera Feeds', '30-Day Encrypted Archive', 'AI Threat Recognition', 'Biometric Access Logs', '24/7 Priority Support']
    },
    {
      name: 'ENTERPRISE_GRID',
      desc: 'Custom hardware and infinite scaling.',
      priceMonthly: 'CUSTOM',
      priceAnnual: 'CUSTOM',
      recommended: false,
      features: ['Unlimited Camera Feeds', 'Infinite Quantum Storage', 'Dedicated Security Team', 'Custom API Integration', 'On-Premise Server Option']
    }
  ];

  toggleBilling(): void {
    this.isAnnual.update(val => !val);
  }
}