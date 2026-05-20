import { Component, ElementRef, OnInit, OnDestroy, signal, Inject, PLATFORM_ID, NgZone, HostListener, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-lens-reveal',
  standalone: true,
  imports: [],
  templateUrl: './lens-reveal.component.html',
  styleUrl: './lens-reveal.component.scss'
})
export class LensRevealComponent implements OnInit, OnDestroy {
  // Grab the video element
  @ViewChild('lensVideo', { static: false }) videoRef!: ElementRef<HTMLVideoElement>;

  targetProgress = 0;
  scrollProgress = signal<number>(0);
  mouseX = signal<number>(0);
  mouseY = signal<number>(0);
  isLocked = signal<boolean>(false);

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
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;
      this.mouseX.set(x);
      this.mouseY.set(y);
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        window.addEventListener('scroll', this.scrollHandler, true);
        this.smoothScrollLoop();
      });
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('scroll', this.scrollHandler, true);
      if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    }
  }

  toggleLock(): void {
    this.isLocked.set(!this.isLocked());
  }

  onScroll(): void {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const elementHeight = this.el.nativeElement.offsetHeight;
    const scrollableDistance = elementHeight - windowHeight;

    if (rect.top <= 0 && rect.bottom >= windowHeight) {
      const rawProgress = Math.abs(rect.top) / scrollableDistance;
      this.targetProgress = Math.min(rawProgress * 1.5, 1);
    } else if (rect.top > 0) {
      this.targetProgress = 0;
    } else {
      this.targetProgress = 1;
    }
  }

  smoothScrollLoop(): void {
    const diff = this.targetProgress - this.scrollProgress();

    if (Math.abs(diff) > 0.001) {
      const newValue = this.scrollProgress() + diff * 0.08;

      this.zone.run(() => {
        this.scrollProgress.set(newValue);
      });

      // --- NEW: THE VIDEO SCRUBBING ENGINE ---
      if (this.videoRef && this.videoRef.nativeElement) {
        const video = this.videoRef.nativeElement;

        // Ensure video is loaded and ready before scrubbing
        if (!isNaN(video.duration) && video.duration > 0) {
          video.currentTime = video.duration * this.scrollProgress();
        }
      }
    }

    this.animationFrameId = requestAnimationFrame(() => this.smoothScrollLoop());
  }
}