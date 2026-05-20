import {
  Component,
  signal,
  HostListener,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})

export class HeroComponent
implements AfterViewInit, OnDestroy {

  // =========================
  // CAMERA ANGLE
  // =========================

  protected cameraAngle =
    signal<'left' | 'center' | 'right'>('center');

  private angleIndex = 0;

  // =========================
  // CAMERA TRANSFORM
  // =========================

  protected cameraTransform =
    signal<string>(
      'translateX(40px) scale(0.75) rotateY(-15deg) rotateX(5deg)'
    );

  // =========================
  // PARTICLES
  // =========================

  @ViewChild('particlesCanvas')
  particlesCanvas!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;

  private particles: Particle[] = [];

  private animationFrameId = 0;

  // =========================
  // CAMERA CLICK
  // =========================

  changeAngle() {

    this.angleIndex++;

    if (this.angleIndex === 1) {

      this.cameraAngle.set('left');

    }

    else if (this.angleIndex === 2) {

      this.cameraAngle.set('right');

    }

    else {

      this.cameraAngle.set('center');

      this.angleIndex = 0;

    }

  }

  // =========================
  // MOUSE MOVE
  // =========================

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {

    const x =
      (window.innerWidth / 2 - e.clientX) / 80;

    const y =
      (window.innerHeight / 2 - e.clientY) / 80;

    this.cameraTransform.set(`
      translateX(40px)
      scale(0.75)
      rotateY(${x}deg)
      rotateX(${y}deg)
    `);

  }

  // =========================
  // INIT
  // =========================

  ngAfterViewInit(): void {

    this.initializeParticles();

  }

  // =========================
  // PARTICLES INIT
  // =========================

  private initializeParticles(): void {

    const canvas =
      this.particlesCanvas.nativeElement;

    this.ctx =
      canvas.getContext('2d')!;

    this.resizeCanvas();

    for (let i = 0; i < 120; i++) {

      this.particles.push(
        new Particle(canvas)
      );

    }

    this.animateParticles();

  }

  // =========================
  // ANIMATE PARTICLES
  // =========================

  private animateParticles(): void {

    const canvas =
      this.particlesCanvas.nativeElement;

    this.ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    this.particles.forEach(particle => {

      particle.y -= particle.speedY;

      if (particle.y < 0) {

        particle.reset();

        particle.y = canvas.height;

      }

      this.ctx.fillStyle =
        `rgba(0,255,255,${particle.opacity})`;

      this.ctx.beginPath();

      this.ctx.arc(
        particle.x,
        particle.y,
        particle.size,
        0,
        Math.PI * 2
      );

      this.ctx.fill();

    });

    this.animationFrameId =
      requestAnimationFrame(() =>
        this.animateParticles()
      );

  }

  // =========================
  // RESIZE
  // =========================

  @HostListener('window:resize')
  onResize() {

    this.resizeCanvas();

  }

  private resizeCanvas(): void {

    const canvas =
      this.particlesCanvas.nativeElement;

    canvas.width =
      window.innerWidth;

    canvas.height =
      window.innerHeight;

  }

  // =========================
  // DESTROY
  // =========================

  ngOnDestroy(): void {

    cancelAnimationFrame(
      this.animationFrameId
    );

  }

}

// =========================
// PARTICLE CLASS
// =========================

class Particle {

  x = 0;
  y = 0;
  size = 0;
  speedY = 0;
  opacity = 0;

  constructor(
    private canvas: HTMLCanvasElement
  ) {

    this.reset();

  }

  reset() {

    this.x =
      Math.random() * this.canvas.width;

    this.y =
      Math.random() * this.canvas.height;

    this.size =
      Math.random() * 2 + 1;

    this.speedY =
      Math.random() * 1 + .2;

    this.opacity =
      Math.random();

  }

}
