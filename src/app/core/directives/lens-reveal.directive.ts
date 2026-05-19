import { Directive, ElementRef, OnInit, OnDestroy, Input, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appLensReveal]',
  standalone: true
})
export class LensRevealDirective implements OnInit, OnDestroy {
  @Input() delay: number = 0;

  private observer: IntersectionObserver | null = null;
  private hasRevealed = false;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: object
  ) { }

  ngOnInit(): void {
    // We apply the stagger delay using a CSS custom property so the stylesheet can use it
    this.renderer.setStyle(this.el.nativeElement, 'transition-delay', `${this.delay}ms`);

    if (isPlatformBrowser(this.platformId)) {
      this.observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !this.hasRevealed) {
          this.hasRevealed = true;
          // When it enters the screen, just add this class!
          this.renderer.addClass(this.el.nativeElement, 'revealed');
        }
      }, { threshold: 0.1 }); // Changed to 0.1 to trigger slightly earlier

      this.observer.observe(this.el.nativeElement);
    }
  }

  ngOnDestroy(): void {
    if (this.observer) this.observer.disconnect();
  }
}