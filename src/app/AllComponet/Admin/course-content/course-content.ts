import { Component } from '@angular/core';
import { GradeDTO } from '../../../InterFace/grade-dto';
import { HttpClient } from '@angular/common/http';
import { GradeService } from '../../../service/grade-service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-course-content',
  imports: [ CommonModule],
  templateUrl: './course-content.html',
  styleUrl: './course-content.css'
})
export class CourseContent{
 grades: GradeDTO[] = [];
  SelectedGradeId:number | null = null;
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
    this.SelectedGradeId=grade.id;
   this.router.navigate(['/AdmenBody/get-all-terms-for-grade']);

  }


}
