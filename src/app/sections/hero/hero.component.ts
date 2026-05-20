// hero.component.ts

import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  signal
} from '@angular/core';

/* =========================
   PARTICLE CLASS
========================= */

class Particle {

  x: number;
  y: number;
  size: number;
  speedY: number;
  opacity: number;

  constructor(
    private canvas: HTMLCanvasElement
  ) {

    this.x =
      Math.random() * canvas.width;

    this.y =
      Math.random() * canvas.height;

    this.size =
      Math.random() * 2 + 1;

    this.speedY =
      Math.random() * 1 + 0.2;

    this.opacity =
      Math.random();
  }

  update() {

    this.y -= this.speedY;

    if (this.y < 0) {

      this.y = this.canvas.height;

      this.x =
        Math.random() * this.canvas.width;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {

    ctx.fillStyle =
      `rgba(0,255,255,${this.opacity})`;

    ctx.beginPath();

    ctx.arc(
      this.x,
      this.y,
      this.size,
      0,
      Math.PI * 2
    );

    ctx.fill();
  }
}

/* =========================
   COMPONENT
========================= */

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent
implements AfterViewInit, OnDestroy {

  /* =========================
     CANVAS
  ========================= */

  @ViewChild('particlesCanvas')
  particlesCanvas!: ElementRef<HTMLCanvasElement>;

  /* =========================
     CAMERA ANGLE
  ========================= */

  protected cameraPosition =
    signal<'left' | 'center' | 'right'>(
      'center'
    );

  private angle = 0;

  /* =========================
     PARTICLES
  ========================= */

  private ctx!: CanvasRenderingContext2D;

  private particles: Particle[] = [];

  private animationFrameId = 0;

  /* =========================
     LIFE CYCLE
  ========================= */

  ngAfterViewInit(): void {

    this.initializeParticles();
  }

  ngOnDestroy(): void {

    cancelAnimationFrame(
      this.animationFrameId
    );
  }

  /* =========================
     CAMERA CLICK
  ========================= */

  changeCameraAngle(): void {

    this.angle++;

    if (this.angle === 1) {

      this.cameraPosition.set('left');
    }

    else if (this.angle === 2) {

      this.cameraPosition.set('right');
    }

    else {

      this.cameraPosition.set('center');

      this.angle = 0;
    }
  }

  /* =========================
     PARTICLE INIT
  ========================= */

  private initializeParticles(): void {

    const canvas =
      this.particlesCanvas.nativeElement;

    this.ctx =
      canvas.getContext('2d')!;

    canvas.width =
      window.innerWidth;

    canvas.height =
      window.innerHeight;

    /* CREATE PARTICLES */

    for (let i = 0; i < 120; i++) {

      this.particles.push(
        new Particle(canvas)
      );
    }

    this.animateParticles();
  }

  /* =========================
     ANIMATION
  ========================= */

  private animateParticles(): void {

    const canvas =
      this.particlesCanvas.nativeElement;

    this.ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    this.particles.forEach(
      particle => {

        particle.update();

        particle.draw(this.ctx);
      }
    );

    this.animationFrameId =
      requestAnimationFrame(() =>
        this.animateParticles()
      );
  }
}
