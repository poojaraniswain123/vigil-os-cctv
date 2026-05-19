import { Component, OnInit, signal, HostListener, Inject, PLATFORM_ID, ChangeDetectionStrategy, effect } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-cursor',
  standalone: true,
  imports: [],
  template: `
    <div class="cursor-ring" 
         [style.transform]="ringTransform()"
         [class.hovering]="isHovering()">
    </div>
    
    <div class="cursor-dot" 
         [style.transform]="dotTransform()">
    </div>
  `,
  styleUrl: './cursor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CursorComponent implements OnInit {
  // 1. Mouse coordinates from event (Signal)
  private mouseX = signal(0);
  private mouseY = signal(0);

  // 2. Lagging coordinates for the ring (Signal)
  private ringX = signal(0);
  private ringY = signal(0);

  // 3. Hover state for scaling (Signal)
  protected isHovering = signal(false);

  // LERP easing amount (0.0 to 1.0) - smaller is slower/laggy
  private lerpFactor = 0.15;

  // Computed styles driven by signals
  protected ringTransform = signal<string>('translate(-50%, -50%) translate(0px, 0px)');
  protected dotTransform = signal<string>('translate(-50%, -50%) translate(0px, 0px)');

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    // Hide default cursor globally on init
    this.document.body.style.cursor = 'none';

    // effect() to update transform strings when ring/dot signals change
    effect(() => {
      this.ringTransform.set(`translate(-50%, -50%) translate(${this.ringX()}px, ${this.ringY()}px)`);
      this.dotTransform.set(`translate(-50%, -50%) translate(${this.mouseX()}px, ${this.mouseY()}px)`);
    });
  }

  ngOnInit(): void {
    // Only run animation loop in browser, not SSR
    if (isPlatformBrowser(this.platformId)) {
      this.startAnimationLoop();
    }
  }

  // A. Listen for mouse movement to set TARGET coordinates
  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseMoveEvent): void {
    this.mouseX.set(event.clientX);
    this.mouseY.set(event.clientY);
  }

  // B. Listen for hover on interactive elements
  @HostListener('window:mouseover', ['$event'])
  onMouseOver(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const isInteractive = ['A', 'BUTTON', 'INPUT'].includes(target.tagName) || target.closest('a, button');
    this.isHovering.set(!!isInteractive);
  }

  @HostListener('window:mouseout', ['$event'])
  onMouseOut(): void {
    this.isHovering.set(false);
  }

  private startAnimationLoop(): void {
    const animateRing = () => {
      // Linear Interpolation (LERP) formula:
      // current = current + (target - current) * ease
      const nextX = this.ringX() + (this.mouseX() - this.ringX()) * this.lerpFactor;
      const nextY = this.ringY() + (this.mouseY() - this.ringY()) * this.lerpFactor;

      // Update the lagging ring signals
      this.ringX.set(nextX);
      this.ringY.set(nextY);

      requestAnimationFrame(animateRing);
    };

    // Initialize animation loop
    requestAnimationFrame(animateRing);
  }
}
// Custom Interface for TS safety
interface MouseMoveEvent extends MouseEvent {
  clientX: number;
  clientY: number;
}