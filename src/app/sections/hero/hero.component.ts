import {
  AfterViewInit,
  Component
} from '@angular/core';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements AfterViewInit {

  cameraClass = 'center';

  private angle = 0;

  changeAngle(): void {

    this.angle++;

    if (this.angle === 1) {

      this.cameraClass = 'left';

    }

    else if (this.angle === 2) {

      this.cameraClass = 'right';

    }

    else {

      this.cameraClass = 'center';
      this.angle = 0;

    }

  }

  ngAfterViewInit(): void {

    this.initializeParticles();

  }

  initializeParticles(): void {

    const canvas =
      document.getElementById('particles') as HTMLCanvasElement;

    const ctx =
      canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: any[] = [];

    class Particle {

      x: number;
      y: number;
      size: number;
      speedY: number;
      opacity: number;

      constructor() {

        this.x =
          Math.random() * canvas.width;

        this.y =
          Math.random() * canvas.height;

        this.size =
          Math.random() * 2 + 1;

        this.speedY =
          Math.random() * 1 + .2;

        this.opacity =
          Math.random();

      }

      update() {

        this.y -= this.speedY;

        if (this.y < 0) {

          this.y = canvas.height;

          this.x =
            Math.random() * canvas.width;

        }

      }

      draw() {

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

    for (let i = 0; i < 120; i++) {

      particles.push(new Particle());

    }

    const animate = () => {

      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      particles.forEach((p: any) => {

        p.update();
        p.draw();

      });

      requestAnimationFrame(animate);

    };

    animate();

    window.addEventListener('resize', () => {

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

    });

  }

}
