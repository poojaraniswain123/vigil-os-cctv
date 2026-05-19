import { Component } from '@angular/core';

@Component({
  selector: 'app-client-logos',
  standalone: true,
  imports: [],
  templateUrl: './client-logos.component.html',
  styleUrl: './client-logos.component.scss'
})
export class ClientLogosComponent {
  // Fake futuristic corporate clients
  row1Logos = [
    'ARES_DEFENSE', 'OMNICORP', 'WEYLAND_YUTANI', 'TYRELL_CORP',
    'CYBER_DYNE', 'MASA_AERO', 'VERTEX_SEC', 'ARES_DEFENSE',
    'OMNICORP', 'WEYLAND_YUTANI' // Duplicated for seamless loop
  ];

  row2Logos = [
    'PALANTIR_SYS', 'STARK_IND', 'OSCORP_TECH', 'LEXCORP',
    'WAYNE_ENT', 'UMBRELLA_CORP', 'APERTURE_SCI', 'PALANTIR_SYS',
    'STARK_IND', 'OSCORP_TECH' // Duplicated for seamless loop
  ];
}