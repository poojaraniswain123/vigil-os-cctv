import {
    Component,
    ElementRef,
    ViewChild,
    AfterViewInit
} from '@angular/core';

@Component({
    selector: 'app-hero',
    standalone: true,
    templateUrl: './hero.component.html',
    styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements AfterViewInit {

    @ViewChild('particlesCanvas')
    canvasRef!: ElementRef<HTMLCanvasElement>;

    cameraPosition: string = 'center';

    private ctx!: CanvasRenderingContext2D;

    particles: any[] = [];

    ngAfterViewInit(): void {

        this.initCanvas();
        this.createParticles();
        this.animateParticles();
    }

    changeAngle(): void {

        if (this.cameraPosition === 'center') {

            this.cameraPosition = 'left';

        } else if (this.cameraPosition === 'left') {

            this.cameraPosition = 'right';

        } else {

            this.cameraPosition = 'center';
        }
    }

    initCanvas(): void {

        const canvas = this.canvasRef.nativeElement;

        this.ctx = canvas.getContext('2d')!;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    createParticles(): void {

        const canvas = this.canvasRef.nativeElement;

        for (let i = 0; i < 120; i++) {

            this.particles.push({

                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 1,
                speed: Math.random() * 1 + 0.3,
                opacity: Math.random()
            });
        }
    }

    animateParticles(): void {

        const canvas = this.canvasRef.nativeElement;

        this.ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        this.particles.forEach((particle) => {

            particle.y -= particle.speed;

            if (particle.y < 0) {

                particle.y = canvas.height;
                particle.x = Math.random() * canvas.width;
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

        requestAnimationFrame(() => {

            this.animateParticles();
        });
    }
}
