import { Component, signal } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss',
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({
        height: '0',
        opacity: '0',
        paddingTop: '0',
        paddingBottom: '0',
        overflow: 'hidden'
      })),
      state('expanded', style({
        height: '*', // Wildcard means "auto" or whatever its natural height is
        opacity: '1',
        paddingTop: '20px',
        paddingBottom: '20px',
        overflow: 'hidden'
      })),
      transition('collapsed <=> expanded', [
        animate('400ms cubic-bezier(0.25, 1, 0.5, 1)')
      ])
    ])
  ]
})
export class FaqComponent {
  // Signal holds the index of the currently open FAQ, or null if all are closed
  activeIndex = signal<number | null>(null);

  faqs = [
    {
      q: 'HOW DOES VIGIL_OS HANDLE POWER OUTAGES?',
      a: 'All core subsystems are equipped with redundant localized battery arrays granting up to 72 hours of autonomous operation. Data feeds switch to localized encrypted cache until network uplinks are restored.'
    },
    {
      q: 'IS THE BIOMETRIC DATA STORED ON CLOUD SERVERS?',
      a: 'No. To comply with absolute zero-trust protocols, all biometric signatures (retinal and fingerprint) are hashed and stored locally on the secure terminal nodes. The cloud only receives verification tokens.'
    },
    {
      q: 'CAN I INTEGRATE EXISTING HARDWARE INTO THE MESH?',
      a: 'Yes. VIGIL_OS is backward compatible with most IP-based ONVIF camera systems. However, autonomous threat-tracking requires our proprietary tactical hardware.'
    },
    {
      q: 'WHAT IS THE RESPONSE TIME FOR THREAT DETECTION?',
      a: 'Our AI neural net processes visual data at 60 frames per second. Threat identification and automated lockdown protocols (like door sealing or alarm triggers) occur in under 400 milliseconds.'
    }
  ];

  toggleFaq(index: number): void {
    // If clicking the one that's already open, close it. Otherwise, open the new one.
    this.activeIndex.update(current => current === index ? null : index);
  }
}