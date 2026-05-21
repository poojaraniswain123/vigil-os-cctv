import { Component, HostListener, signal, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-camera-visual',
  standalone: true,
  imports: [],
  templateUrl: './camera-visual.component.html',
  styleUrl: './camera-visual.component.scss'
})
export class CameraVisualComponent implements OnInit, OnDestroy {
  // Signals for animations
  cameraOpacity = signal<number>(1);
  parallaxTransform = signal<string>('translateX(22vw)');
  cameraTransform = signal<string>('scale(0.85) rotateY(-15deg) rotateX(5deg)');

  // Live Timer Signals
  currentSec = signal<string>('00');
  currentMs = signal<string>('00');
  private timerId: any;

  ngOnInit() {
    this.updateParallax();
    // Live HUD Timer (50ms interval for milliseconds feel)
    this.timerId = setInterval(() => {
      const d = new Date();
      this.currentSec.set(d.getSeconds().toString().padStart(2, '0'));
      this.currentMs.set(Math.floor(d.getMilliseconds() / 10).toString().padStart(2, '0'));
    }, 50);
  }

  ngOnDestroy() {
    if (this.timerId) clearInterval(this.timerId);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    // Only track mouse when at the top
    if (window.scrollY > 100 || window.innerWidth <= 1024) return;
    const x = (window.innerWidth / 2 - e.clientX) / 25;
    const y = (window.innerHeight / 2 - e.clientY) / 25;
    this.cameraTransform.set(`scale(0.88) rotateY(${x}deg) rotateX(${y}deg)`);
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() { this.updateParallax(); }

  @HostListener('window:resize', ['$event'])
  onResize() { this.updateParallax(); }
  private updateParallax() {
    if (typeof window === 'undefined') return;

    const scrollValue = window.scrollY || document.documentElement.scrollTop;
    const isMobile = window.innerWidth <= 1024;

    // --- 1. PROGRESS CALCULATION ---
    // Camera reaches center after 800px of scrolling
    const scrollMax = 800;
    const progress = Math.min(1, scrollValue / scrollMax);

    // --- 2. OPACITY (Fades to 15%) ---
    this.cameraOpacity.set(Math.max(0.15, 1 - (progress * 0.85)));

    // --- 3. SLIDE TO CENTER (25vw -> 0vw) ---
    if (isMobile) {
      this.parallaxTransform.set(`translate3d(0, 0, 0)`);
    } else {
      const currentVW = 25 * (1 - progress);
      // Use translate3d for hardware acceleration (smoother movement)
      this.parallaxTransform.set(`translate3d(${currentVW}vw, 0, 0)`);
    }

    // --- 4. CAMERA ANGLE (Face the user as it centers) ---
    if (scrollValue > 5) {
      const rotateY = -15 + (progress * 15); // Faces forward at progress 1
      const rotateX = 5 + (Math.sin(scrollValue * 0.005) * 5); // Subtle bobbing
      const scale = isMobile ? 0.6 : (0.85 - (progress * 0.1));

      this.cameraTransform.set(`scale(${scale}) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`);
    } else {
      const scale = isMobile ? 0.6 : 0.85;
      this.cameraTransform.set(`scale(${scale}) rotateY(-15deg) rotateX(5deg)`);
    }
  }
}