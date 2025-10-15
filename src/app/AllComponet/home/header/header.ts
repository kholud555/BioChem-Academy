import { Component , AfterViewInit, ElementRef} from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements AfterViewInit {
  
  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    const elements = this.el.nativeElement.querySelectorAll(
      '.fade-in-left, .fade-in-right, .slide-up, .fade-in'
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-active');
          } else {
            entry.target.classList.remove('animate-active');
          }
        });
      },
      { threshold: 0.2 } // يبدأ لما يظهر 20% من العنصر
    );

    elements.forEach((el: Element) => observer.observe(el));
  }
}
