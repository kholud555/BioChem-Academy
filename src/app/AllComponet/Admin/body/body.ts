import { Component } from '@angular/core';
import { SideNav } from "../side-nav/side-nav";
import { RouterOutlet } from "@angular/router";
@Component({
  selector: 'app-body',
  imports: [SideNav, RouterOutlet],
  templateUrl: './body.html',
  styleUrl: './body.css'
})
export class Body {

}
