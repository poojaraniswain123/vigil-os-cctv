import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';

interface CameraFeed {
  id: string;
  location: string;
  hasMotion: boolean;
  colorFilter: string; // To give each camera a slightly different tint
}

@Component({
  selector: 'app-live-feed-mockup',
  standalone: true,
  imports: [],
  templateUrl: './live-feed-mockup.component.html',
  styleUrl: './live-feed-mockup.component.scss'
})
export class LiveFeedMockupComponent implements OnInit, OnDestroy {
  // Live Clock Signal
  private timeSignal = signal<Date>(new Date());
  protected liveTimestamp = computed(() => {
    const d = this.timeSignal();
    return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  });

  private timerId: any;

  feeds: CameraFeed[] = [
    { id: 'CAM-07', location: 'MAIN LOBBY // ENTRY_A', hasMotion: false, colorFilter: 'hue-rotate(0deg)' },
    { id: 'CAM-08', location: 'SERVER_RACK // L2', hasMotion: true, colorFilter: 'hue-rotate(180deg) sepia(0.5)' }, // This one has the motion alert
    { id: 'CAM-09', location: 'PARKING_GARAGE // B1', hasMotion: false, colorFilter: 'hue-rotate(90deg) grayscale(0.5)' },
    { id: 'CAM-10', location: 'PERIMETER_WALL // WEST', hasMotion: false, colorFilter: 'sepia(0.8) hue-rotate(80deg)' } // Night vision green tint
  ];

  ngOnInit(): void {
    this.timerId = setInterval(() => {
      this.timeSignal.set(new Date());
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }
}