import { Injectable } from '@angular/core';

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class PixelService {

  loadPixel(pixelId: string) {

    // لو الـ Pixel اتحمّل قبل كده — ما تعيديش تحميله
    if (window.fbq) return;

    (function (f: any, b: Document, e: string, v: string) {
      if (f.fbq) return;

      const n: any = function () {
        n.callMethod
          ? n.callMethod.apply(n, arguments)
          : n.queue.push(arguments);
      };

      f.fbq = n;
      if (!f._fbq) f._fbq = n;

      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];

      const t = b.createElement(e) as HTMLScriptElement; // ✔️ حل مشكلة async + src
      t.async = true;
      t.src = v;

      const s = b.getElementsByTagName(e)[0];
      s.parentNode?.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    // ✔️ تهيئة الـ Pixel
    window.fbq('init', pixelId);

    // ✔️ تسجيل PageView تلقائي
    window.fbq('track', 'PageView');
  }

  // 🔥 للتتبع عند الضغط على زر، أو فتح درس، أو أي event
  track(eventName: string, params: any = {}) {
    if (window.fbq) {
      window.fbq('track', eventName, params);
    }
  }
}
