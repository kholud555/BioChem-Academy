import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { routes } from './app.routes';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule } from '@angular/forms';
import { PixelService } from './services/pixel';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet , NgxSpinnerModule , FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('my-app');
  constructor(
    private router: Router,
    private pixelService: PixelService){}

    ngOnInit() {
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        this.pixelService.trackEvent('PageView', { page: event.urlAfterRedirects });
      }
    });
  }
}
