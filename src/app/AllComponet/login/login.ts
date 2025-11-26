import { Component } from '@angular/core';
import { ReactiveFormsModule , FormGroup , FormControl } from '@angular/forms';
import { StudentService } from '../../service/Student/student-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  LoginForm:FormGroup= new FormGroup({
     email:new FormControl(''),
  password:new FormControl(''),

  })
 constructor(private login:StudentService , private router:Router , private toast :ToastrService ,  private location: Location, ){}
 
 
  onSubmit(){
  
    // console.log(this. LoginForm.value);
     
this.login.loginStudent(this. LoginForm.value).subscribe({
  next:(res)=>{
   
    const token = res.token;
    const name= res.userName;
    const role=res.role;
    const userId=res.userId;
    this.login.setLoginData(token,name,role,userId);
    
  
    this.toast.success("login Successfully  " ,   " Welcome "+res.userName);
    this.LoginForm.reset();
    if(role == "Admin"){
      this.router.navigate(['/AdmenBody'])
    }
    else{
    this.router.navigate(['/home']);
    }
  },
  error:(err)=>{
    

   this.toast.error("invalid email or password" , "Login Failed");
  }
})
  
}
goBack() {
    this.location.back();
  }

}
