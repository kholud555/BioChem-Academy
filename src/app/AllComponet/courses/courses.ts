import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../service/Student/student-service';
import { ActivatedRoute } from '@angular/router';
import { StudentAccessedMediaDTO } from '../../InterFace/media-dto';
import { CommonModule } from '@angular/common';
import { StudentDto } from '../../InterFace/student-dto';
import { GradeService } from '../../service/grade-service';
import { TermService } from '../../service/term-service';
import { UnitService } from '../../service/unit-service';
import { LessonService } from '../../service/lesson-service';
import { AccessControlService } from '../../service/access-controll-service';
import { ToastrService } from 'ngx-toastr';
import { TermDTO } from '../../InterFace/term-dto';
import { GradeDTO } from '../../InterFace/grade-dto';
import { UnitDTO } from '../../InterFace/unit-dto';
import { LessonDTO } from '../../InterFace/lesson-dto';


@Component({
  selector: 'app-courses',
  imports: [CommonModule],
  templateUrl: './courses.html',
  styleUrl: './courses.css'
})
export class Courses implements OnInit {

  lessonId!: number;
  mediaList: StudentAccessedMediaDTO[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    // ⬅️ جلب lessonId من الرابط
    this.lessonId = Number(this.route.snapshot.paramMap.get('lessonId'));

    if (!this.lessonId) {
      this.errorMessage = "❌ Lesson ID not found in URL!";
      this.isLoading = false;
      return;
    }

    this.loadLessonMedia();
  }

  loadLessonMedia() {
    this.studentService.getMediaForStudentByLessonId(this.lessonId).subscribe({
      next: (data) => {
        this.mediaList = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = "You don't have permission to access this lesson.";
        this.isLoading = false;
      }
    });
  }
}