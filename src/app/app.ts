import { Component, HostListener, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { routes } from './app.routes';
import { NgxSpinnerModule } from 'ngx-spinner';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet , NgxSpinnerModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('my-app');

  
  // منع Right Click
  @HostListener('document:contextmenu', ['$event'])
  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }

  // منع F12 و Ctrl+Shift+I/J و Ctrl+U
  @HostListener('document:keydown', ['$event'])
  disableKeys(event: KeyboardEvent) {
    // F12
    if (event.key === 'F12') event.preventDefault();

    // Ctrl+Shift+I
    if (event.ctrlKey && event.shiftKey && event.key === 'I') event.preventDefault();

    // Ctrl+Shift+J
    if (event.ctrlKey && event.shiftKey && event.key === 'J') event.preventDefault();

    // Ctrl+U
    if (event.ctrlKey && event.key === 'U') event.preventDefault();
  }
}
