import { Component } from '@angular/core';
import { ReactiveFormsModule , FormGroup , FormControl } from '@angular/forms';
import { StudentService } from '../../service/Student/student-service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  LoginForm:FormGroup= new FormGroup({
     email:new FormControl(''),
  password:new FormControl(''),

  })
 constructor(private login:StudentService , private router:Router){}

 
  onSubmit(){
  
    console.log(this. LoginForm.value);
this.login.loginStudent(this. LoginForm.value).subscribe({
  next:(res)=>{
    const token = res.token;
    const name= res.userName;
    const role=res.role;
    const userId=res.userId;
    this.login.setLoginData(token,name,role,userId);
    
  
    alert("login Successfully" + res.userName);
    this.LoginForm.reset();
    this.router.navigate(['/home']);
  },
  error:(err)=>{

    alert(err.error.message);
  }
})
  
}

}
