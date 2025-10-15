import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-slider',
  imports: [CommonModule, MdbCarouselModule, RouterLink],
  templateUrl: './slider.html',
  styleUrl: './slider.css'
})
export class Slider {

}
