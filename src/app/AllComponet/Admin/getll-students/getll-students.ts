import { Component } from '@angular/core';
import { StudentService } from '../../../service/Student/student-service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-getll-students',
  imports: [CommonModule, RouterLink],
  templateUrl: './getll-students.html',
  styleUrl: './getll-students.css'
})
export class GetllStudents {
  students:any[]=[];
  SelectedStusent:any| null=null;
  SelectedStusentName:string| null=null;
  SelectedStusentGrade:string| null=null;
  SelectedStusentId:any|Number=0;
  constructor(
    private studentService : StudentService,
    private toast : ToastrService
  ){}

  ngOnInit(): void {
    this.LoadAllStudent();
  }
  LoadAllStudent(){
    this.studentService.getAllStudent().subscribe({
      next:(res)=>{
        this.students=res;
          this.toast.success("All Students loaded successfully");
         console.log("✅ All Students loaded successfully:", res);

      },
      error:(err)=>{
        this.toast.error("Error loading students" );
    
      }
    })
  }

  selectedStudent(student : any):void{
this.SelectedStusentName=student.userName;
this.SelectedStusentName=student.studentId;
this.SelectedStusentGrade=student.grade;
this.SelectedStusentId=student.id;

  }
}



