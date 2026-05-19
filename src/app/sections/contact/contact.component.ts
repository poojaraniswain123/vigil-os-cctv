import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  // Tracks the state of the form: 'idle', 'transmitting', or 'success'
  formState = signal<'idle' | 'transmitting' | 'success'>('idle');

  onSubmit(event: Event): void {
    event.preventDefault(); // Prevent page reload

    // Simulate an encrypted data transmission
    this.formState.set('transmitting');

    setTimeout(() => {
      this.formState.set('success');
    }, 2500); // 2.5 seconds of "encrypting" before success
  }
}