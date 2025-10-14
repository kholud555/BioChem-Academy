import { Component } from '@angular/core';
import { ReactiveFormsModule , FormGroup , FormControl } from '@angular/forms';
import { StudentService } from '../../service/Student/student-service';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule ],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
isLoading:boolean=false;
 showPassword = false;
showConfirmPassword = false;
 
RegisterForm:FormGroup=new FormGroup({
  phoneNumber:new FormControl(''),
   userName:new FormControl(''),
  grade:new FormControl(''),
   parentPhone:new FormControl(''),
  email:new FormControl(''),
  password:new FormControl(''),
  confirmPassword:new FormControl(''),
});

constructor(private register:StudentService , private router:Router){}
 togglePassword() {
    this.showPassword = !this.showPassword;
  }
 toggleConfirmPassword(){
    this.showConfirmPassword = !this.showConfirmPassword;
 }
  onSubmit(){
  this.isLoading=true;
    console.log(this.RegisterForm.value);
this.register.RegistrationStudent(this.RegisterForm.value).subscribe({
  next:(res)=>{
    this.router.navigate(['/login']);
    alert("Registration Successfully");
    this.RegisterForm.reset();
  },
  error:(err)=>{
    this.isLoading=false;
    alert(err.error.message);
  }
})
  
}

}