import { Component } from '@angular/core';

@Component({
  selector: 'app-camera-fleet',
  standalone: true,
  imports: [],
  templateUrl: './camera-fleet.component.html',
  styleUrl: './camera-fleet.component.scss'
})
export class CameraFleetComponent {

  // Your Camera Product Lineup
  products = [
    {
      id: 'C-PTZ-X1',
      name: 'VIGIL_CORE 360',
      category: 'Omnidirectional PTZ',
      desc: 'Our flagship pan-tilt-zoom array. Features predictive AI motion locking, 40x optical zoom, and seamless 360-degree continuous rotation.',
      features: ['AI Motion Tracking', '40x Optical Zoom', 'Thermal Overlay'],
      // ADD THIS LINE TO EACH PRODUCT
      image: '/cameras/cam-1.png'
    },
    {
      id: 'C-BUL-V2',
      name: 'NIGHT_STALKER IR',
      category: 'Long-Range Bullet',
      desc: 'Engineered for zero-lux environments. Captures crystal clear facial recognition data up to 150 meters in pitch black using military-grade infrared.',
      features: ['150m IR Range', 'Facial Recognition', 'IP67 Weatherproof'],
      image: '/cameras/cam-2.png'
    },
    {
      id: 'C-DOM-S3',
      name: 'STEALTH_DOME',
      category: 'Vandal-Proof Dome',
      desc: 'Discreet, high-durability surveillance. Housed in IK10 vandal-resistant casing with ultra-wide 180-degree panoramic lenses.',
      features: ['IK10 Vandal-Proof', '180° Panoramic Lens', 'Edge Analytics'],
      image: '/cameras/cam-3.png'
    }
  ];
}