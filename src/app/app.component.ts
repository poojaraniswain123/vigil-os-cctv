import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CursorComponent } from './shared/components/cursor/cursor.component';
import { ParallaxDirective } from './core/directives/parallax.directive';
import { HeroComponent } from './sections/hero/hero.component'; // Import here
import { ThemeService } from './app/core/services/theme.service';
import { ClientLogosComponent } from './sections/client-logos/client-logos.component';
import { StatsComponent } from './sections/stats/stats.component';
import { ServicesComponent } from './sections/services/services.component';
import { LiveFeedMockupComponent } from './sections/live-feed-mockup/live-feed-mockup.component';
import { HowItWorksComponent } from './sections/how-it-works/how-it-works.component';
import { VisionShowcaseComponent } from './sections/vision-showcase/vision-showcase.component';
import { PricingComponent } from './sections/pricing/pricing.component';
import { FaqComponent } from './sections/faq/faq.component';
import { ContactComponent } from './sections/contact/contact.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CursorComponent, ParallaxDirective, HeroComponent, ClientLogosComponent
    , StatsComponent
    , ServicesComponent
    , LiveFeedMockupComponent
    , HowItWorksComponent
    , VisionShowcaseComponent
    , PricingComponent
    , FaqComponent
    , ContactComponent
  ], // Include here
  template: `
    <app-cursor />
    <div class="surveillance-bg" appParallax [parallaxRatio]="0.15"></div>
    <div class="noise-overlay"></div>

    <app-hero />
    <app-client-logos />
    <app-stats />

    <app-services />
    <app-live-feed-mockup />
    <app-how-it-works />
    <app-vision-showcase />
    <app-pricing />
    <app-faq />
    <app-contact />
    <router-outlet />
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'cctv-security-solutions';

  constructor(private themeService: ThemeService) { }
}