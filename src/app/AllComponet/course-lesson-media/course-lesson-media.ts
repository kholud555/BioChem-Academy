import { Component, OnInit, OnDestroy } from '@angular/core';
import { LessonDTO } from '../../InterFace/lesson-dto';
import { LessonService } from '../../service/lesson-service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StudentService } from '../../service/Student/student-service';
import { StudentAccessedMediaDTO } from '../../InterFace/media-dto';
import { CommonModule } from '@angular/common';
import { NavBar } from "../nav-bar/nav-bar";

@Component({
  selector: 'app-course-lesson-media',
  templateUrl: './course-lesson-media.html',
  styleUrls: ['./course-lesson-media.css'],
  imports: [CommonModule, NavBar]
})
export class CourseLessonMedia implements OnInit, OnDestroy {
  SelectLesson: LessonDTO | null = null;
  SelectedLessonId: number = 0;
  studentId: number | null = 0;
  mediaList: StudentAccessedMediaDTO[] = [];

  constructor(
    private lessonService: LessonService,
    private studentService: StudentService,
    private router: Router,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    document.addEventListener("keydown", this.disableKeys);

    // محاولة الحصول على الدرس من service (مثلاً عند اختيار درس جديد)
    const currentLesson = this.lessonService.getLesson();

    if (currentLesson) {
      this.SelectLesson = currentLesson;
      this.SelectedLessonId = currentLesson.id;
      // تحديث الـ sessionStorage بالدرس الجديد
      sessionStorage.setItem('selectedLesson', JSON.stringify(this.SelectLesson));
      sessionStorage.setItem('selectedLessonId', this.SelectedLessonId.toString());
    } else {
      // لو مفيش درس من service، جرب تجيب من sessionStorage
      const storedLesson = sessionStorage.getItem('selectedLesson');
      const storedLessonId = sessionStorage.getItem('selectedLessonId');

      if (storedLesson) {
        this.SelectLesson = JSON.parse(storedLesson) as LessonDTO;
        this.SelectedLessonId = this.SelectLesson.id;
      } else if (storedLessonId) {
        this.SelectedLessonId = Number(storedLessonId);
      } else {
        // لا يوجد درس، ارجع لقائمة الدروس
        console.warn("No lesson selected!");
        this.router.navigate(['/courses']);
        return;
      }
    }

    // جلب studentId من sessionStorage أو service
    const savedStudentId = sessionStorage.getItem('studentId');
    if (savedStudentId) {
      this.studentId = Number(savedStudentId);
    } else {
      this.studentId = this.studentService.getuserId();
      if (this.studentId) sessionStorage.setItem('studentId', this.studentId.toString());
    }

    // تحميل الميديا للدرس الحالي
    this.loadMediaForLesson(this.SelectedLessonId);
  }

  loadMediaForLesson(lessonId: number) {
    this.studentService.getMediaByLessonForStudent(lessonId).subscribe({
      next: (res) => {
        this.mediaList = res;
        console.log("Media Loaded:", res);
      },
      error: (err) => {
        console.error("Error loading media", err);
      }
    });
  }

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }

  disableKeys = (e: KeyboardEvent) => {
    // F12
    if (e.key === "F12") e.preventDefault();

    // Ctrl+Shift+I
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i") e.preventDefault();

    // Ctrl+Shift+J
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "j") e.preventDefault();

    // Ctrl+U
    if (e.ctrlKey && e.key.toLowerCase() === "u") e.preventDefault();

    // Ctrl+S
    if (e.ctrlKey && e.key.toLowerCase() === "s") e.preventDefault();
  };

  ngOnDestroy() {
    document.removeEventListener("keydown", this.disableKeys);
  }
}
