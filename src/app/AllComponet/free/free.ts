import { Component, OnInit } from '@angular/core';
import { FreeContentDTO } from '../../InterFace/media-dto';
import { StudentService } from '../../service/Student/student-service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LessonService } from '../../service/lesson-service';
import { LessonDTO } from '../../InterFace/lesson-dto';
import { GradeDTO } from '../../InterFace/grade-dto';
import { HttpClient } from '@angular/common/http';
import { GradeService } from '../../service/grade-service';
import { SubjectDTO } from '../../InterFace/subject';
import { SubjectService } from '../../service/subject';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-free',
  standalone: true,
  imports: [CommonModule , FormsModule],
  templateUrl: './free.html',
  styleUrl: './free.css'
})
export class Free implements OnInit {
  
  subjects: SubjectDTO[] = [];
  selectedSubjectId: number = 0;

  grades: GradeDTO[] = [];
  SelectedGradeName: string | null = null;

  constructor(
    private http: HttpClient,
    private gradeService: GradeService,
    private subjectService: SubjectService,
    private router: Router,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadSubjects();
  }

  // Load all subjects
  loadSubjects(): void {
    this.subjectService.getAllSubjects().subscribe({
      next: data => this.subjects = data,
      error: err => console.error(err)
    });
  }

  onSubjectChange(): void {
    this.grades = [];

    this.gradeService.getGradeBySubjectId(this.selectedSubjectId).subscribe({
      next: res => this.grades = res,
      error: err => console.error(err)
    });
  }

  onSelectGrade(grade: GradeDTO) {
    this.gradeService.setGrade(grade);
    this.SelectedGradeName = grade.gradeName;
    this.router.navigate(['ShowFreeMedia']);
  }
}
