import {
  Component, HostListener, signal,
  OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, NgZone
} from '@angular/core';

@Component({
  selector: 'app-camera-visual',
  standalone: true,
  imports: [],
  templateUrl: './camera-visual.component.html',
  styleUrl: './camera-visual.component.scss'
})
export class CameraVisualComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('cameraCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private readonly TOTAL_FRAMES = 80;
  private readonly SCROLL_MAX = 3000;
  private images: HTMLImageElement[] = [];
  private loaded: boolean[] = new Array(80).fill(false);
  private loadedCount = 0;
  private rafId: number | null = null;
  private lastFrameIndex = -1;
  private ctx: CanvasRenderingContext2D | null = null;
  private canvasSized = false;

  cameraOpacity = signal<number>(1);
  parallaxTransform = signal<string>('translateX(22vw)');
  cameraTransform = signal<string>('scale(0.85) rotateY(-15deg) rotateX(5deg)');
  currentSec = signal<string>('00');
  currentMs = signal<string>('00');
  loadProgress = signal<number>(0);

  private timerId: any;

  constructor(private ngZone: NgZone) { }

  ngOnInit() {
    this.startTimer();
    this.updateParallax();
  }

  ngAfterViewInit() {
    // Get canvas context immediately
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d');

    // Start preloading
    this.preloadImages();

    // Run rAF loop OUTSIDE Angular zone for performance
    this.ngZone.runOutsideAngular(() => {
      this.startRafLoop();
    });
  }

  ngOnDestroy() {
    if (this.timerId) clearInterval(this.timerId);
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }

  // ─── Timer ────────────────────────────────────────────────────────────────
  private startTimer() {
    this.timerId = setInterval(() => {
      const d = new Date();
      this.currentSec.set(d.getSeconds().toString().padStart(2, '0'));
      this.currentMs.set(Math.floor(d.getMilliseconds() / 10).toString().padStart(2, '0'));
    }, 50);
  }

  // ─── Preloader — uses onload, NOT decode() ────────────────────────────────
  private preloadImages() {
    for (let i = 0; i < this.TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNumber = (i + 1).toString().padStart(3, '0');
      img.src = `/Camera-Ani/ffout${frameNumber}.gif`;

      const index = i;

      img.onload = () => {
        this.loaded[index] = true;
        this.loadedCount++;
        this.loadProgress.set(Math.floor((this.loadedCount / this.TOTAL_FRAMES) * 100));

        // Size the canvas ONCE from the very first image that loads
        if (!this.canvasSized && index === 0 && this.ctx) {
          const canvas = this.canvasRef.nativeElement;
          canvas.width = img.naturalWidth;   // 1280
          canvas.height = img.naturalHeight; // 720
          this.canvasSized = true;

          // Draw frame 0 immediately so canvas isn't blank on page load
          this.ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          this.lastFrameIndex = 0;

          console.log(`✅ Canvas sized: ${canvas.width}x${canvas.height}`);
        }
      };

      img.onerror = () => {
        console.error(`❌ Missing: /Camera-Ani/ffout${frameNumber}.gif`);
      };

      this.images.push(img);
    }
  }

  // ─── rAF Loop ─────────────────────────────────────────────────────────────
  private startRafLoop() {
    const loop = () => {
      const frameIndex = this.getFrameIndex();

      // Only redraw if frame actually changed
      if (frameIndex !== this.lastFrameIndex && this.loaded[frameIndex]) {
        this.renderFrame(frameIndex);
        this.lastFrameIndex = frameIndex;
      }

      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  private getFrameIndex(): number {
    const scroll = Math.max(
      window.scrollY,
      window.pageYOffset,
      document.documentElement.scrollTop,
      document.body.scrollTop
    );
    const progress = Math.min(1, scroll / this.SCROLL_MAX);
    const frame = Math.min(this.TOTAL_FRAMES - 1, Math.floor(progress * this.TOTAL_FRAMES));
    return frame;
  }

  private renderFrame(index: number) {
    if (!this.ctx || !this.canvasSized) return;
    const canvas = this.canvasRef.nativeElement;
    const img = this.images[index];
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }

  // ─── Mouse Parallax ───────────────────────────────────────────────────────
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (window.scrollY > 100 || window.innerWidth <= 1024) return;
    const x = (window.innerWidth / 2 - e.clientX) / 25;
    const y = (window.innerHeight / 2 - e.clientY) / 25;
    this.cameraTransform.set(`scale(0.88) rotateY(${x}deg) rotateX(${y}deg)`);
  }

  @HostListener('window:scroll')
  onScroll() { this.updateParallax(); }

  @HostListener('window:resize')
  onResize() { this.updateParallax(); }

  // ─── Parallax & Opacity ───────────────────────────────────────────────────
  private updateParallax() {
    if (typeof window === 'undefined') return;
    const scroll = Math.max(
      window.scrollY,
      window.pageYOffset,
      document.documentElement.scrollTop,
      document.body.scrollTop
    );
    
    const isMobile = window.innerWidth <= 1024;
    const progress = Math.min(1, scroll / this.SCROLL_MAX);

    this.cameraOpacity.set(Math.max(0.15, 1 - progress * 0.85));

    if (isMobile) {
      this.parallaxTransform.set('translate3d(0, 0, 0)');
    } else {
      const vw = 25 * (1 - progress);
      this.parallaxTransform.set(`translate3d(${vw}vw, 0, 0)`);
    }

    if (scroll > 5) {
      const rotateY = -15 + progress * 15;
      const rotateX = 5 + Math.sin(scroll * 0.005) * 5;
      const scale = isMobile ? 0.6 : 0.85 - progress * 0.1;
      this.cameraTransform.set(`scale(${scale}) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`);
    } else {
      const scale = isMobile ? 0.6 : 0.85;
      this.cameraTransform.set(`scale(${scale}) rotateY(-15deg) rotateX(5deg)`);
    }
  }
}