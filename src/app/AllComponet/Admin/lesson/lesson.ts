import { Component, OnInit } from '@angular/core';
import { CreateLessonDTO, LessonDTO } from '../../../InterFace/lesson-dto';
import { GradeService } from '../../../service/grade-service';
import { UnitService } from '../../../service/unit-service';
import { LessonService } from '../../../service/lesson-service';
import { TermService } from '../../../service/term-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lesson',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lesson.html',
  styleUrls: ['./lesson.css']
})
export class Lesson implements OnInit {
  grades: any[] = [];
  terms: any[] = [];
  units: any[] = [];
  lessons: LessonDTO[] = [];

  selectedGradeId = 0;
  selectedTermId = 0;
  selectedUnitId = 0;

  selectedLessonId: number | null = null; // ✅ لتحديد الدرس الجاري تعديله

  newLesson: CreateLessonDTO = {
    title: '',
    description: '',
    order: 1,
    isFree: false,
    isPublished: false,
    unitId: 0
  };

  constructor(
    private gradeService: GradeService,
    private termService: TermService,
    private unitService: UnitService,
    private lessonService: LessonService
  ) {}

  ngOnInit(): void {
    this.loadGrades();
  }

  // 🟢 تحميل الصفوف
  loadGrades(): void {
    this.gradeService.GetAllGrade().subscribe({
      next: (res) => (this.grades = res),
      error: (err) => console.error('Error loading grades:', err)
    });
  }

  // 🔹 عند اختيار صف
  onGradeChange(): void {
    this.termService.getTermsByGrade(this.selectedGradeId).subscribe({
      next: (res) => {
        this.terms = res;
        this.units = [];
        this.lessons = [];
        this.selectedTermId = 0;
        this.selectedUnitId = 0;
      }
    });
  }

  // 🔹 عند اختيار ترم
  onTermChange(): void {
    this.unitService.getUnitsByTerm(this.selectedTermId).subscribe({
      next: (res) => {
        this.units = res;
        this.lessons = [];
        this.selectedUnitId = 0;
      }
    });
  }

  // 🔹 عند اختيار وحدة
  onUnitChange(): void {
    if (this.selectedUnitId > 0) {
      this.lessonService.getLessonsByUnit(this.selectedUnitId).subscribe({
        next: (res) => (this.lessons = res),
        error: (err) => console.error('Error loading lessons:', err)
      });
    }
  }

  // 🟩 إضافة درس جديد
  addLesson(): void {
    if (this.selectedUnitId === 0) {
     Swal.fire('Error', 'PLEASE ADD UNIT FIRST', 'error');
      
      return;
    }

    this.newLesson.unitId = this.selectedUnitId;

    this.lessonService.addLesson(this.newLesson).subscribe({
      next: (res) => {
        this.lessons.push(res);
        this.newLesson = {
          title: '',
          description: '',
          order: 1,
          isFree: false,
          isPublished: false,
          unitId: this.selectedUnitId
        };
       Swal.fire('Success', 'Unit added successfully.', 'success');
       
      },
      error: (err) =>
       Swal.fire('Error', 'Failed to lesson term.', 'error')
      
    });
  }

  // 🗑️ حذف درس
  deleteLesson(id: number): void {
    if (!confirm('Are you sure you want to delete this lesson?')) return;

    this.lessonService.deleteLesson(id).subscribe({
      next: () => {
        this.lessons = this.lessons.filter((l) => l.id !== id);
        
      Swal.fire('Success', '🗑️ Lesson deleted successfully.', 'success');
       
      },
      error: (err) =>
       
     Swal.fire('Error', err.error?.message || err.message, 'error')
      
    });
  }

  // ✏️ تفعيل وضع التعديل
  enableEdit(lessonId: number): void {
    this.selectedLessonId = lessonId;
  }

  // ✅ حفظ التعديل
  saveEdit(lesson: LessonDTO): void {
    this.lessonService.updateLesson(lesson).subscribe({
      next: () => {
        this.selectedLessonId = null;
       
      },
      error: (err) =>
        Swal.fire('Error', 'Failed ', 'error')
      
    
    });
  }

  // ❌ إلغاء التعديل
  cancelEdit(): void {
    this.selectedLessonId = null;
    this.onUnitChange(); // لإعادة تحميل البيانات الأصلية
  }
}
