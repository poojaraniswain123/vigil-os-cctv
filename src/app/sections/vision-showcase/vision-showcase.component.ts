import { Component, ElementRef, OnInit, OnDestroy, signal, Inject, PLATFORM_ID, NgZone, HostListener } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-vision-showcase',
  standalone: true,
  imports: [],
  templateUrl: './vision-showcase.component.html',
  styleUrl: './vision-showcase.component.scss'
})
export class VisionShowcaseComponent implements OnInit, OnDestroy {
  // We now have TWO values: where the user scrolled (target) and where the UI actually is (current)
  targetProgress = 0;

  // The UI is bound to this smoothed signal
  scrollProgress = signal<number>(0);
  mouseX = signal<number>(0);
  mouseY = signal<number>(0);
  isLocked = signal<boolean>(false);

  toggleLock(): void {
    this.isLocked.set(!this.isLocked());
  }

  blades = [0, 1, 2, 3, 4, 5];

  private scrollHandler = this.onScroll.bind(this);
  private animationFrameId: number | null = null;

  constructor(
    private el: ElementRef,
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: object
  ) { }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (isPlatformBrowser(this.platformId)) {
      // Normalize the cursor position so the center of the screen is 0
      // Top-Left is -1, -1  |  Bottom-Right is 1, 1
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;

      this.mouseX.set(x);
      this.mouseY.set(y);
    }
  }
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        // CRITICAL FIX: Put 'true' back in to capture the scroll event!
        window.addEventListener('scroll', this.scrollHandler, true);

        // Start the smooth animation loop
        this.smoothScrollLoop();
      });
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      // CRITICAL FIX: Must also be 'true' here to remove it properly
      window.removeEventListener('scroll', this.scrollHandler, true);

      if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    }
  }

  onScroll(): void {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const elementHeight = this.el.nativeElement.offsetHeight;
    const scrollableDistance = elementHeight - windowHeight;

    if (rect.top <= 0 && rect.bottom >= windowHeight) {
      // THE FIX: Multiply by 1.5 to finish early, and cap it at 1.0 (fully open)
      const rawProgress = Math.abs(rect.top) / scrollableDistance;
      this.targetProgress = Math.min(rawProgress * 1.5, 1);
    } else if (rect.top > 0) {
      this.targetProgress = 0;
    } else {
      this.targetProgress = 1;
    }
  }

  // The LERP Loop: This makes the blades feel HEAVY and smooth.
  smoothScrollLoop(): void {
    // Calculate the difference between where we are and where we want to be
    const diff = this.targetProgress - this.scrollProgress();

    // If the difference is large enough, move 8% of the way there (this creates the buttery ease-out)
    if (Math.abs(diff) > 0.001) {
      const newValue = this.scrollProgress() + diff * 0.08;

      this.zone.run(() => {
        this.scrollProgress.set(newValue);
      });
    }

    // Keep the loop running
    this.animationFrameId = requestAnimationFrame(() => this.smoothScrollLoop());
  }
}