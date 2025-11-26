import { Component } from '@angular/core';
import { StudentService } from '../../service/Student/student-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { StudentDto, StudentExamResultDTO } from '../../InterFace/student-dto';

@Component({
  selector: 'app-student-result',
  imports: [],
  templateUrl: './student-result.html',
  styleUrl: './student-result.css'
})
export class StudentResult {

   students:StudentDto[]=[];
  // SelectedStusent:StudentDto| null=null;
  // SelectedStusentName:string| null=null;
  // SelectedStusentGrade:string| null=null;
  // SelectedStusentId:any|Number=0;
  studentResults: StudentExamResultDTO[] = [];
showStudentResults: boolean = false;

  constructor(
    private studentService : StudentService,
    private toast : ToastrService,
    private router : Router,
  ){}
 

}
