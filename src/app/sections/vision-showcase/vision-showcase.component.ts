import { Component, ElementRef, HostListener, signal, Inject, PLATFORM_ID, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-vision-showcase',
  standalone: true,
  imports: [],
  templateUrl: './vision-showcase.component.html',
  styleUrl: './vision-showcase.component.scss'
})
export class VisionShowcaseComponent {
  // Signal holding our scroll progress (0.0 to 1.0)
  scrollProgress = signal<number>(0);

  // Array to generate 6 blades with an index variable
  blades = [0, 1, 2, 3, 4, 5];

  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: object
  ) { }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Get the bounding box of our tall 300vh container
    const rect = this.el.nativeElement.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const elementHeight = this.el.nativeElement.offsetHeight;

    // The total distance the user has to scroll while the container is sticky
    const scrollableDistance = elementHeight - windowHeight;

    // Calculate progress based on how far the top of the container is above the viewport
    if (rect.top <= 0 && rect.bottom >= windowHeight) {
      // We are actively scrolling inside the pinned section
      let progress = Math.abs(rect.top) / scrollableDistance;

      // Add a slight easing curve to make it feel heavier and mechanical
      progress = Math.pow(progress, 1.2);

      // Clamp between 0 and 1
      this.scrollProgress.set(Math.min(Math.max(progress, 0), 1));
    } else if (rect.top > 0) {
      // Above the section
      this.scrollProgress.set(0);
    } else {
      // Scrolled completely past the section
      this.scrollProgress.set(1);
    }
  }
}