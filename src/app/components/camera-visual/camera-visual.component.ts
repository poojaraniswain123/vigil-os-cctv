import { Component, HostListener, signal, OnInit } from '@angular/core';

@Component({
  selector: 'app-camera-visual',
  standalone: true,
  imports: [],
  templateUrl: './camera-visual.component.html',
  styleUrl: './camera-visual.component.scss'
})
export class CameraVisualComponent implements OnInit {
  // 1. Watermark Sliding Math
  parallaxTransform = signal<string>('translateX(22vw)');
  cameraOpacity = signal<number>(1);

  // 2. 3D Rotation Math
  cameraTransform = signal<string>('scale(0.85) rotateY(-15deg) rotateX(5deg)');

  // 3. Click-to-Turn Logic
  cameraAngle = signal<number>(0);

  ngOnInit() {
    this.updateParallax();
  }

  get cameraClass(): string {
    if (this.cameraAngle() === 1) return 'camera left';
    if (this.cameraAngle() === 2) return 'camera right';
    return 'camera center';
  }

  toggleCameraAngle() {
    let current = this.cameraAngle();
    current++;
    if (current > 2) current = 0;
    this.cameraAngle.set(current);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (window.scrollY > 100 || window.innerWidth <= 1024) return;
    const x = (window.innerWidth / 2 - e.clientX) / 25;
    const y = (window.innerHeight / 2 - e.clientY) / 25;
    this.cameraTransform.set(
      `scale(0.88) rotateY(${x}deg) rotateX(${y}deg)`
    );
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    this.updateParallax();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.updateParallax();
  }

  private updateParallax() {
    if (typeof window === 'undefined') return;

    const scrollValue = window.scrollY || document.documentElement.scrollTop;
    const isMobile = window.innerWidth <= 1024;
    const isLargeScreen = window.innerWidth > 1400;

    // 1. WATERMARK FADE: Fades down to 15%, never fully disappearing
    const fadeProgress = Math.min(1, scrollValue / 400);
    const newOpacity = 1 - (fadeProgress * 0.95);
    this.cameraOpacity.set(Math.max(0.05, newOpacity));

    // 2. SLIDE TO CENTER: Starts at 22vw (Right side), slides to 0px (Absolute Center)
    const baseOffset = isLargeScreen ? 0.35 : 0.28; 
    const startX = isMobile ? 0 : window.innerWidth * baseOffset;
    const currentX = startX * (1 - fadeProgress);

    // Apply the position updates
    this.parallaxTransform.set(`translateX(${currentX}px)`);

    if (scrollValue > 5) {
      const rotateY = scrollValue * 0.15;
      const rotateX = Math.sin(scrollValue * 0.02) * 15;
      const scale = isMobile ? 0.6 : (0.85 - (fadeProgress * 0.2)); // Shrinks slightly as it centers

      this.cameraTransform.set(`scale(${scale}) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`);
    } else {
      // Base state at top of page
      const scale = isMobile ? 0.6 : 0.85;
      this.cameraTransform.set(`scale(${scale}) rotateY(-15deg) rotateX(5deg)`);
    }
  }
}