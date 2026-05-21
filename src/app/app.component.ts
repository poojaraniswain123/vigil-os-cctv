import { Component, Inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Imports from your build
import { CursorComponent } from './shared/components/cursor/cursor.component';
import { ParallaxDirective } from './core/directives/parallax.directive';
import { HeroComponent } from './sections/hero/hero.component';
import { ClientLogosComponent } from './sections/client-logos/client-logos.component';
import { StatsComponent } from './sections/stats/stats.component';
import { ServicesComponent } from './sections/services/services.component';
import { LiveFeedMockupComponent } from './sections/live-feed-mockup/live-feed-mockup.component';
import { HowItWorksComponent } from './sections/how-it-works/how-it-works.component';
import { VisionShowcaseComponent } from './sections/vision-showcase/vision-showcase.component';
import { PricingComponent } from './sections/pricing/pricing.component';
import { FaqComponent } from './sections/faq/faq.component';
import { ContactComponent } from './sections/contact/contact.component';
import { DOCUMENT } from '@angular/common';
import { LensRevealComponent } from './sections/lens-reveal/lens-reveal.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { AboutUsComponent } from './sections/about-us/about-us.component';
import { CameraFleetComponent } from './sections/camera-fleet/camera-fleet.component';
import { FooterComponent } from './components/footer/footer.component';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CursorComponent, ParallaxDirective, HeroComponent, ClientLogosComponent, StatsComponent, ServicesComponent, LiveFeedMockupComponent, HowItWorksComponent, VisionShowcaseComponent, PricingComponent, FaqComponent, ContactComponent, LensRevealComponent, NavbarComponent, AboutUsComponent, CameraFleetComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'cctv-security-solutions';
  isLightMode = signal<boolean>(false);

  constructor(@Inject(DOCUMENT) private document: Document) { }

  toggleTheme(): void {
    const currentState = !this.isLightMode();
    this.isLightMode.set(currentState);

    if (currentState) {
      this.document.body.classList.add('light-mode');
    } else {
      this.document.body.classList.remove('light-mode');
    }
  }
}