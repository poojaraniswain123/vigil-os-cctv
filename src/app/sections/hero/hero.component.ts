import { Component, OnInit, signal, computed, OnDestroy, HostListener } from '@angular/core';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  animations: [
    trigger('contentFadeIn', [
      transition(':enter', [
        query('.hud-element', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger(150, [
            animate('800ms 1.2s cubic-bezier(0.25, 1, 0.5, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class HeroComponent implements OnInit, OnDestroy {
  // --- System Boot Signals ---
  protected bootText = signal<string>('');
  protected isBooted = signal<boolean>(false);

  // --- Live Clock Signals ---
  private currentTime = signal<Date>(new Date());
  protected formattedTimestamp = computed(() => {
    const d = this.currentTime();
    return `${d.toLocaleDateString()} // ${d.toLocaleTimeString()}`;
  });

  private timerId: any;
  private bootPhrases = [
    'INITIALIZING CORE_VIGIL_OS... DONE',
    'CONNECTING TO SURVEILLANCE MESH... SECURE',
    'SYNCING APERTURE MOTORS... CALIBRATED',
    'DECRYPTING VIDEO STREAM SUBSYSTEMS... SUCCESS',
    'OPENING LENS BLADES...'
  ];

  // --- 3D Camera Math & Interaction Signals ---
  cameraTransform = signal<string>('translateX(40px) scale(0.75) rotateY(-15deg) rotateX(5deg)');

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (window.scrollY > 50) return; 
    
    // INCREASED INTERACTIVITY: Divided by 40 instead of 80 to make it track the mouse much faster!
    const x = (window.innerWidth / 2 - e.clientX) / 35;
    const y = (window.innerHeight / 2 - e.clientY) / 35;
    
    this.cameraTransform.set(`translateX(40px) scale(0.75) rotateY(${x}deg) rotateX(${y}deg)`);
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const scrollValue = window.scrollY || document.documentElement.scrollTop;
    
    if (scrollValue > 5) {
      const rotateY = scrollValue * 0.15; 
      const rotateX = Math.sin(scrollValue * 0.02) * 15;
      const moveX = 40 + Math.sin(scrollValue * 0.02) * 50; 
      
      const moveY = scrollValue * 0.6; 
      const scale = 0.75 + (scrollValue * 0.0003);

      this.cameraTransform.set(`
        translateX(${moveX}px)
        translateY(${moveY}px)
        scale(${scale})
        rotateY(${rotateY}deg)
        rotateX(${rotateX}deg)
      `);
    } else {
      this.cameraTransform.set('translateX(40px) scale(0.75) rotateY(-15deg) rotateX(5deg)');
    }
  }

  // --- Lifecycle Hooks ---
  ngOnInit(): void {
    this.runBootSequence();
    this.startLiveFeedClock();
  }

  ngOnDestroy(): void {
    if (this.timerId) clearInterval(this.timerId);
  }

  private runBootSequence(): void {
    let phase = 0;
    const interval = setInterval(() => {
      if (phase < this.bootPhrases.length) {
        this.bootText.set(this.bootPhrases[phase]);
        phase++;
      } else {
        clearInterval(interval);
        this.isBooted.set(true);
      }
    }, 450);
  }

  private startLiveFeedClock(): void {
    this.timerId = setInterval(() => {
      this.currentTime.set(new Date());
    }, 1000);
  }
}
