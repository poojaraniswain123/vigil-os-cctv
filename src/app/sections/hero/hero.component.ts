import { Component, OnInit, signal, computed, OnDestroy, HostListener } from '@angular/core';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  animations: [
    // Staggered fade and slide up for text elements inside the aperture lens
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
  // Signals for system boot sequence
  protected bootText = signal<string>('');
  protected isBooted = signal<boolean>(false);
  cameraOffset = signal<number>(0);
  // Signal for live updating CCTV timestamp
  private currentTime = signal<Date>(new Date());
  protected formattedTimestamp = computed(() => {
    const d = this.currentTime();
    return `${d.toLocaleDateString()} // ${d.toLocaleTimeString()}`;
  });
  @HostListener('window:scroll', ['$event'])
  onScroll() {
    // Multiplying by 0.35 creates a smooth, delayed floating effect
    this.cameraOffset.set(window.scrollY * 0.35);
  }
  private timerId: any;
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
        // Mark as booted to slide open the lens blades!
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