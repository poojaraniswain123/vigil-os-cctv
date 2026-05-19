import { Component, ElementRef, OnInit, OnDestroy, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [],
  templateUrl: './how-it-works.component.html',
  styleUrl: './how-it-works.component.scss'
})
export class HowItWorksComponent implements OnInit, OnDestroy {
  // Signal to trigger the CSS animations
  protected drawLine = signal<boolean>(false);
  private observer: IntersectionObserver | null = null;

  steps = [
    { num: '01', title: 'ASSESS', desc: 'Tactical evaluation of perimeters, blind spots, and network vulnerabilities.' },
    { num: '02', title: 'INSTALL', desc: 'Deployment of high-grade optical, thermal, and biometric hardware.' },
    { num: '03', title: 'CONFIGURE', desc: 'Neural net calibration and seamless VIGIL_OS synchronization.' },
    { num: '04', title: 'MONITOR', desc: '24/7 active threat detection with automated lockdown protocols.' }
  ];

  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setupObserver();
    }
  }

  ngOnDestroy(): void {
    if (this.observer) this.observer.disconnect();
  }

  private setupObserver(): void {
    // Trigger when the section is 30% visible
    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !this.drawLine()) {
        this.drawLine.set(true);
      }
    }, { threshold: 0.3 });

    // Target the main container
    const container = this.el.nativeElement.querySelector('.timeline-container');
    if (container) {
      this.observer.observe(container);
    }
  }
}