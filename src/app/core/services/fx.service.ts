import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class FxService {
  // Signal to track Night Vision mode
  isNightVision = signal<boolean>(false);
  private audioCtx: AudioContext | null = null;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      // Initialize Web Audio API (with Safari fallback)
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
  }

  // 1. Synthesize a techy "Hover Beep"
  playHoverBeep(): void {
    if (!this.audioCtx) return;

    // Resume context if browser suspended it
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

    const osc = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();

    // 'square' waves sound very digital/retro
    osc.type = 'square';

    // Start at 800Hz and ramp up to 1200Hz very quickly
    osc.frequency.setValueAtTime(800, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.audioCtx.currentTime + 0.1);

    // Keep volume low (0.02) and fade out instantly to avoid clicking
    gainNode.gain.setValueAtTime(0.02, this.audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.1);

    osc.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.1);
  }

  // 2. Synthesize an "Error / Alert" Buzz
  playAlertBuzzer(): void {
    if (!this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

    const osc = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();

    osc.type = 'sawtooth'; // Harsher, aggressive sound
    osc.frequency.setValueAtTime(150, this.audioCtx.currentTime); // Low pitch

    gainNode.gain.setValueAtTime(0.05, this.audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.5);

    osc.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.5);
  }

  // 3. Toggle Night Vision Mode
  toggleNightVision(): void {
    const currentState = !this.isNightVision();
    this.isNightVision.set(currentState);

    if (currentState) {
      this.document.body.classList.add('night-vision-active');
      this.playAlertBuzzer(); // Sound an alert when entering night mode!
    } else {
      this.document.body.classList.remove('night-vision-active');
      this.playHoverBeep();
    }
  }
}