import { Component, OnInit } from '@angular/core';
import { FreeContentDTO } from '../../InterFace/media-dto';
import { StudentService } from '../../service/Student/student-service';
import { Toast, ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { LessonService } from '../../service/lesson-service';
import { LessonDTO } from '../../InterFace/lesson-dto';
import { GradeDTO } from '../../InterFace/grade-dto';
import { HttpClient } from '@angular/common/http';
import { GradeService } from '../../service/grade-service';

@Component({
  selector: 'app-free',
  imports: [CommonModule],
  templateUrl: './free.html',
  styleUrl: './free.css'
})
export class Free implements OnInit{
 grades: GradeDTO[] = [];
 SelectedGradeName:string | null = null;
  constructor(private http: HttpClient ,
     private gradeService:GradeService ,  
     private router : Router ,
     private toast : ToastrService)  { }
  ngOnInit(): void {
    this.loadGrades();
  }
  loadGrades(): void {
    this.gradeService.GetAllGrade().subscribe(
      (data: GradeDTO[]) => {
        this.grades = data;
        this.toast.success("Grades loaded successfully");
       
      },
      (error) => {
        console.error('Error fetching grades:', error);
      }
    );
  }
  onSelectGrade(grade:GradeDTO){
    this.gradeService.setGrade(grade);
    this.SelectedGradeName=grade.gradeName;
   this.router.navigate(['ShowFreeMedia']);

  }


}
