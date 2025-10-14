import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { StudentService } from '../../service/Student/student-service';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink ,NgbCollapseModule ],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css'
})
export class NavBar {
  
  constructor(private router: Router , private auth:StudentService ) {}
  isCollapsed = true;
 isLoggedIn(): boolean {
    return this.auth.iSlogin();
  }
  getUserName(): string {
    return this.auth.getUserName();
  }
 logOut(){
  this.auth.clearToken();
  
  this.router.navigate(['/home']);
  alert("LogOut Successfully");
 }

}
