import { Component, OnInit } from '@angular/core';
import { FreeContentDTO } from '../../InterFace/media-dto';
import { StudentService } from '../../service/Student/student-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { LessonService } from '../../service/lesson-service';
import { GradeService } from '../../service/grade-service';
import { CommonModule } from '@angular/common';
import { NavBar } from "../nav-bar/nav-bar";

// Interface مع خاصية show لكل درس
interface FreeContentViewModel extends FreeContentDTO {
  show: boolean;
}

@Component({
  selector: 'app-show-free-media',
  templateUrl: './show-free-media.html',
  styleUrl: './show-free-media.css',
  imports: [CommonModule, NavBar]
})
export class ShowFreeMedia implements OnInit {

  freeContents: FreeContentViewModel[] = [];
  loading = false;
  selectedGrade: string | null = null;
selectedLessonId:number | null=null;
  constructor(
    private student: StudentService,
    private toastr: ToastrService,
    private router: Router,
    private lessonService: LessonService,
    private gradeService: GradeService
  ) {}

  ngOnInit(): void {
    this.selectedGrade = this.gradeService.getGrade()?.gradeName || null;
    this.loadFreeContent();
  }

  loadFreeContent(): void {
    this.loading = true;

    this.student.getAllFreeContent().subscribe({
      next: (res) => {
        this.freeContents = res
          .filter(item => item.gradeName === this.selectedGrade)
          .map(item => ({ ...item, show: false }));
          

        this.loading = false;

        if (this.freeContents.length === 0) {
          this.toastr.warning("No content available for this grade");
        } else {
          this.toastr.success("Content loaded successfully");
        }
      },
      error: (err) => {
        console.error('Error loading free content:', err);
        this.loading = false;
      }
    });
  }
}
