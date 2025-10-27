import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-side-nav',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.css'
})
export class SideNav {
 isCollapsed = false;

  
sidebarVisible = false;

toggleSidebar() {
  if (window.innerWidth <= 992) {
    this.sidebarVisible = !this.sidebarVisible;
  } else {
    this.isCollapsed = !this.isCollapsed;
  }
}

}
