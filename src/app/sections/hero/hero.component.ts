import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  AfterViewInit,
  ViewChild,
  ElementRef,
  signal,
  computed
} from '@angular/core';

class Particle {

  x: number;
  y: number;
  size: number;
  speedY: number;
  opacity: number;

  constructor(
    private canvas: HTMLCanvasElement
  ) {

    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 1;
    this.speedY = Math.random() * 1 + 0.2;
    this.opacity = Math.random();
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

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent
  implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('particlesCanvas')
  particlesCanvas!: ElementRef<HTMLCanvasElement>;

  protected bootText = signal<string>('');
  protected isBooted = signal<boolean>(false);

  protected cameraPosition =
    signal<'center' | 'left' | 'right'>('center');

  cameraTransform = signal<string>(
    'translateX(40px) scale(0.75) rotateY(-15deg) rotateX(5deg)'
  );

  private currentTime =
    signal<Date>(new Date());

  protected formattedTimestamp =
    computed(() => {

      const d = this.currentTime();

      return `
        ${d.toLocaleDateString()}
        //
        ${d.toLocaleTimeString()}
      `;
    });

  private timerId: any;

  private angle = 0;

  private ctx!: CanvasRenderingContext2D;

  private particles: Particle[] = [];

  private animationFrameId: number = 0;

  private bootPhrases = [
    'INITIALIZING CORE_VIGIL_OS... DONE',
    'CONNECTING TO SURVEILLANCE MESH... SECURE',
    'SYNCING APERTURE MOTORS... CALIBRATED',
    'DECRYPTING VIDEO STREAM SUBSYSTEMS... SUCCESS',
    'OPENING LENS BLADES...'
  ];

  ngOnInit(): void {

    this.runBootSequence();

    this.startLiveFeedClock();
  }

  ngAfterViewInit(): void {

    this.initializeParticles();
  }

  ngOnDestroy(): void {

    if (this.timerId) {
      clearInterval(this.timerId);
    }

    cancelAnimationFrame(this.animationFrameId);
  }

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

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {

    if (window.scrollY > 50) return;

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

  @HostListener('window:scroll')
  onScroll(): void {

    const scrollValue =
      window.scrollY ||
      document.documentElement.scrollTop;

    if (scrollValue > 5) {

      const rotateY =
        scrollValue * 0.15;

      const rotateX =
        Math.sin(scrollValue * 0.02) * 15;

      const moveX =
        40 + Math.sin(scrollValue * 0.02) * 50;

      const moveY =
        scrollValue * 0.6;

      const scale =
        0.75 + (scrollValue * 0.0003);

      this.cameraTransform.set(`
        translateX(${moveX}px)
        translateY(${moveY}px)
        scale(${scale})
        rotateY(${rotateY}deg)
        rotateX(${rotateX}deg)
      `);
    }
    else {

      this.cameraTransform.set(`
        translateX(40px)
        scale(0.75)
        rotateY(-15deg)
        rotateX(5deg)
      `);
    }
  }

  @HostListener('window:resize')
  onResize(): void {

    const canvas =
      this.particlesCanvas.nativeElement;

    canvas.width = window.innerWidth;

    canvas.height = window.innerHeight;
  }

  private initializeParticles(): void {

    const canvas =
      this.particlesCanvas.nativeElement;

    this.ctx =
      canvas.getContext('2d')!;

    canvas.width = window.innerWidth;

    canvas.height = window.innerHeight;

    this.particles = [];

    for (let i = 0; i < 120; i++) {

      this.particles.push(
        new Particle(canvas)
      );
    }

    this.animateParticles();
  }

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

      particle.update();

      particle.draw(this.ctx);
    });

    this.animationFrameId =
      requestAnimationFrame(() =>
        this.animateParticles()
      );
  }

  private runBootSequence(): void {

    let phase = 0;

    const interval = setInterval(() => {

      if (phase < this.bootPhrases.length) {

        this.bootText.set(
          this.bootPhrases[phase]
        );

        phase++;
      }
      else {

        clearInterval(interval);

        this.isBooted.set(true);
      }

    }, 450);
  }

  private startLiveFeedClock(): void {

    this.timerId = setInterval(() => {

      this.currentTime.set(
        new Date()
      );

    }, 1000);
  }
}
