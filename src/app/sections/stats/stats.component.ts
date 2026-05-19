import { Component, ElementRef, OnInit, OnDestroy, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface Stat {
  label: string;
  targetValue: number;
  prefix: string;
  suffix: string;
  percentage: number; // For the SVG ring (0-100)

  // Signals for reactive UI updates
  currentValue: any;
  currentOffset: any;
}

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss'
})
export class StatsComponent implements OnInit, OnDestroy {
  // SVG Circle Math: radius = 45. Circumference = 2 * PI * 45 ≈ 283
  private readonly CIRCUMFERENCE = 283;
  private observer: IntersectionObserver | null = null;
  private hasAnimated = false;

  stats: Stat[] = [
    { label: 'CAMERAS INSTALLED', targetValue: 10000, prefix: '', suffix: '+', percentage: 100, currentValue: signal(0), currentOffset: signal(this.CIRCUMFERENCE) },
    { label: 'SYSTEM UPTIME', targetValue: 99.9, prefix: '', suffix: '%', percentage: 99, currentValue: signal(0), currentOffset: signal(this.CIRCUMFERENCE) },
    { label: 'MONITORING', targetValue: 24, prefix: '', suffix: '/7', percentage: 100, currentValue: signal(0), currentOffset: signal(this.CIRCUMFERENCE) },
    { label: 'ENTERPRISE CLIENTS', targetValue: 500, prefix: '', suffix: '+', percentage: 85, currentValue: signal(0), currentOffset: signal(this.CIRCUMFERENCE) }
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
    const options = { root: null, rootMargin: '0px', threshold: 0.3 };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated) {
          this.hasAnimated = true;
          this.animateStats();
        }
      });
    }, options);

    this.observer.observe(this.el.nativeElement);
  }

  private animateStats(): void {
    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Cubic ease-out function for smooth deceleration
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      this.stats.forEach(stat => {
        // 1. Update Number Value
        const currentNum = stat.targetValue * easeProgress;
        // Format to 1 decimal place if it's a float (like 99.9), else integer
        const formattedNum = stat.targetValue % 1 !== 0 ? currentNum.toFixed(1) : Math.floor(currentNum);
        stat.currentValue.set(formattedNum);

        // 2. Update SVG Ring Offset
        const targetOffset = this.CIRCUMFERENCE - (this.CIRCUMFERENCE * (stat.percentage / 100));
        const currentOffset = this.CIRCUMFERENCE - ((this.CIRCUMFERENCE - targetOffset) * easeProgress);
        stat.currentOffset.set(currentOffset);
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }
}