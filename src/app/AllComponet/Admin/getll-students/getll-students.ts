import { Component } from '@angular/core';
import { StudentService } from '../../../service/Student/student-service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StudentDto, StudentExamResultDTO } from '../../../InterFace/student-dto';

@Component({
  selector: 'app-getll-students',
  imports: [CommonModule ],
  templateUrl: './getll-students.html',
  styleUrl: './getll-students.css'
})
export class GetllStudents {
  students:StudentDto[]=[];
  // SelectedStusent:StudentDto| null=null;
  // SelectedStusentName:string| null=null;
  // SelectedStusentGrade:string| null=null;
  SelectedStusentId:any|Number=0;
  studentResults: StudentExamResultDTO[] = [];
showStudentResults: boolean = false;

  constructor(
    private studentService : StudentService,
    private toast : ToastrService,
    private router : Router,
  ){}

  ngOnInit(): void {
    this.LoadAllStudent();
  }

 
  LoadAllStudent(){
    this.studentService.getAllStudent().subscribe({
      next:(res)=>{
        this.students=res;
          this.toast.success("All Students loaded successfully");
        
      },
      error:(err)=>{
        this.toast.error("Error loading students" );
    
      }
    })
  }

  onSelectStudent(student:StudentDto){
    this.studentService.setStudent(student);
    this.SelectedStusentId=student.id;
    this.router.navigate(['/AdmenBody/AccessControl']);
  }
onSelectStudentResult(student:StudentDto){
    this.studentService.setStudent(student);
    this.SelectedStusentId=student.id;
    this.router.navigate(['/AdmenBody/result']);
  }


}



