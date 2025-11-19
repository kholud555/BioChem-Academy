import { Injectable } from '@angular/core';

declare global {
  interface Window { fbq: any; _fbq: any; }
}

@Injectable({
  providedIn: 'root'
})
export class PixelService {

  constructor() { this.loadPixel(); }

  private loadPixel() {
    // Facebook Pixel code مُعدل ليعمل مع TypeScript
    if (!window.fbq) {
      window.fbq = function() {
        window.fbq.callMethod ? window.fbq.callMethod.apply(window.fbq, arguments) : window.fbq.queue.push(arguments);
      };
      window.fbq.queue = [];
      window.fbq.loaded = true;
      window.fbq.version = '2.0';

      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      const firstScript = document.getElementsByTagName('script')[0];
      firstScript.parentNode?.insertBefore(script, firstScript);
    }

    // استبدل بـ Pixel ID الخاص بك
    window.fbq('init', 'YOUR_PIXEL_ID');
    window.fbq('track', 'PageView');
  }

  trackEvent(eventName: string, params?: any) {
    if (window.fbq) {
      window.fbq('track', eventName, params);
    }
  }

  trackLead() { this.trackEvent('Lead'); }
  trackAddToCart(value?: number, currency?: string) {
    this.trackEvent('AddToCart', { value, currency });
  }
  trackPurchase(value: number, currency: string) {
    this.trackEvent('Purchase', { value, currency });
  }
  trackCompleteRegistration() { this.trackEvent('CompleteRegistration'); }
}
