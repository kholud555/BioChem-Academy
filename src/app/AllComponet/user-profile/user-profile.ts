import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { StudentAccess } from '../../service/student-access';
import { StudentService } from '../../service/Student/student-service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { Profile } from '../../InterFace/register';

@Component({
  selector: 'app-user-profile',
  imports: [RouterLink , FormsModule ],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css'
})
export class UserProfile implements OnInit{
   studentData: Profile = {
   userName  :  ""  ,
    email  :    ""  ,
    grade  :    ""   ,
    phoneNumber  :   ""   ,
    parentNumber  :    "" 
  };

  

  constructor (private StudentService : StudentService , private Toast : ToastrService){}
  ngOnInit(): void {
    this.LoadProfile();
  }
  LoadProfile(){
    this.StudentService.getStudentProfile().subscribe({
      next:(res)=>{
         console.log('API response:', res); // 
        this.studentData=res;
      },
      error:(err)=>{
  console.error('Error loading profile', err);
      }
    })
    
  }
UpdateProfile():void{
  this.StudentService.UpdateStudentProfile(this.studentData).subscribe({
    next:(res)=>{

     this.Toast.success("Update ")
    }
    ,
    error:(err)=>{
 this.Toast.error("Error")
    }
  })

  
}

}
