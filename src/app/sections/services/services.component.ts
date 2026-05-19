import { Component } from '@angular/core';
import { LensRevealDirective } from '../../core/directives/lens-reveal.directive';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [LensRevealDirective], // IMPORT DIRECTIVE HERE
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent {
  services = [
    { id: 'CAM-01', title: 'TACTICAL MONITORING', desc: '24/7 AI-driven threat detection and automated response protocols.', icon: '⌖' },
    { id: 'CAM-02', title: 'BIOMETRIC ACCESS', desc: 'High-security retinal and fingerprint scanning for restricted zones.', icon: '◎' },
    { id: 'CAM-03', title: 'PERIMETER DEFENSE', desc: 'Thermal imaging and motion-activated radar tracking systems.', icon: '◬' },
    { id: 'CAM-04', title: 'DRONE SURVEILLANCE', desc: 'Autonomous aerial patrols linked directly to the VIGIL_OS network.', icon: '✈' },
    { id: 'CAM-05', title: 'ENCRYPTED ARCHIVES', desc: 'Quantum-encrypted cloud storage for untamperable video log histories.', icon: '⚿' },
    { id: 'CAM-06', title: 'CYBER METRICS', desc: 'Network vulnerability scanning and live firewall integrity diagnostics.', icon: '⚡' }
  ];
}