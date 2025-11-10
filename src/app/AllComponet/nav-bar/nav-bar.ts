import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { StudentService } from '../../service/Student/student-service';
import { ToastrService } from 'ngx-toastr';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';
@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink ,NgbCollapseModule ],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css'
})
export class NavBar {
  
  constructor(private router: Router , private auth:StudentService , private toast :ToastrService ) {}
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
  this.toast.info("LogOut Successfully");
 }
 IsAdmin(){
  return this.auth.IsAdmin();
 }
 isStudent(){
  return this.auth.IsStudent();
 }
 scrollToSection(sectionId: string) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}


}
