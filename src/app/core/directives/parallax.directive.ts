import { Directive, ElementRef, HostListener, Input, Renderer2, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appParallax]',
  standalone: true
})
export class ParallaxDirective {
  // Allows us to customize speed. 0.3 means it moves at 30% of scroll speed.
  @Input() parallaxRatio: number = 0.3;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: object
  ) { }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    // Ensure this only runs in the browser, not during SSR
    if (isPlatformBrowser(this.platformId)) {
      const scrollPosition = window.scrollY;
      const transformValue = `translateY(${scrollPosition * this.parallaxRatio}px)`;

      // Use Renderer2 for safe DOM manipulation
      this.renderer.setStyle(this.el.nativeElement, 'transform', transformValue);
    }
  }
}