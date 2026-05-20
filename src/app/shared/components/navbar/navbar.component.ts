import { Component, HostListener, signal } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isScrolled = signal<boolean>(false);
  isMenuOpen = signal<boolean>(false);

  toggleMenu() {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled.set(window.scrollY > 50);
  }
}