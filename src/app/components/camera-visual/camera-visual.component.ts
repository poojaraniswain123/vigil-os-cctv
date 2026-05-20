import { Component, HostListener, signal } from '@angular/core';

@Component({
  selector: 'app-camera-visual',
  standalone: true,
  imports: [],
  templateUrl: './camera-visual.component.html',
  styleUrl: './camera-visual.component.scss'
})
export class CameraVisualComponent {
  // Signals for 3D rotation, Parallax movement, and fading Opacity
  cameraTransform = signal<string>('rotateY(-15deg) rotateX(5deg)');
  parallaxTransform = signal<string>('translateY(0px)');
  cameraOpacity = signal<number>(1);

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (window.scrollY > 50 || window.innerWidth <= 1024) return;

    // Smooth 3D mouse tracking
    const x = (window.innerWidth / 2 - e.clientX) / 40;
    const y = (window.innerHeight / 2 - e.clientY) / 40;

    this.cameraTransform.set(`rotateY(${x}deg) rotateX(${y}deg)`);
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const scrollValue = window.scrollY || document.documentElement.scrollTop;

    // 1. VANISHING: Fades out completely after 400px of scrolling down
    const newOpacity = Math.max(0, 1 - (scrollValue / 400));
    this.cameraOpacity.set(newOpacity);

    // 2. SCROLLING: A very gentle parallax, allowing it to scroll UP naturally with the page
    const moveY = scrollValue * 0.2;
    this.parallaxTransform.set(`translateY(${moveY}px)`);

    if (scrollValue > 5) {
      // Gentle spin as it scrolls away
      const rotateY = scrollValue * 0.15;
      const rotateX = Math.sin(scrollValue * 0.02) * 15;
      this.cameraTransform.set(`rotateY(${rotateY}deg) rotateX(${rotateX}deg)`);
    } else {
      this.cameraTransform.set('rotateY(-15deg) rotateX(5deg)');
    }
  }
}