import { Component, NgModule } from '@angular/core';
import { GradeDTO } from '../../../InterFace/grade-dto';
import { UnitDTO } from '../../../InterFace/unit-dto';
import { TermDTO } from '../../../InterFace/term-dto';
import { LessonDTO } from '../../../InterFace/lesson-dto';
import { GradeService } from '../../../service/grade-service';
import { TermService } from '../../../service/term-service';
import { UnitService } from '../../../service/unit-service';
import { LessonService } from '../../../service/lesson-service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-make-lesson-free',
  imports: [CommonModule],
  templateUrl: './make-lesson-free.html',
  styleUrl: './make-lesson-free.css'
})
export class MakeLessonFree {
 grades: GradeDTO[] = [];
  terms: TermDTO[] = [];
  units:UnitDTO[] = [];
  lessons: LessonDTO[] = [];

  selectedGradeId = 0;
  selectedTermId = 0;
  selectedUnitId = 0;

  selectedLessonId: number | null = null;
  constructor(
      private gradeService: GradeService,
      private termService: TermService,
      private unitService: UnitService,
      private lessonService: LessonService,
      private toast:ToastrService
    ) {}
  
    ngOnInit(): void {
      this.loadGrades();
    }
  
    
  loadGrades(): void {
    this.gradeService.GetAllGrade().subscribe({
      next: (res) => (this.grades = res),
      error: (err) => console.error('Error loading grades:', err),
    });
  }

  onGradeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedGradeId = Number(select.value);
    this.terms = [];
    this.termService.getTermsByGrade(this.selectedGradeId!).subscribe({
      next: (res) => (this.terms = res),
    });
  }

   onTermChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedTermId = Number(select.value);
    this.units = [];
    this.lessons = [];
    this.selectedUnitId = 0;
    this.selectedLessonId = null;

   this.unitService.getUnitsByTerm(this.selectedTermId).subscribe({
  next: (res) => (this.units = res),
});

  }

  onUnitChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedUnitId = Number(select.value);
    this.lessons = [];
    this.lessonService.getLessonsByUnit(this.selectedUnitId!).subscribe({
      next: (res) => (this.lessons = res),
    });
  }

  onLessonChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedLessonId = Number(select.value);
  }

  // المتغير لتخزين حالة الدروس Free (يمكن تملأها عند جلب الدروس)
lessonFreeStatus: { [key: number]: boolean } = {};

toggleLessonFree(event: Event) {
  const checkbox = event.target as HTMLInputElement;
  const isFree = checkbox.checked;

  if (!this.selectedLessonId) return;

  this.lessonService.updateIsFree(this.selectedLessonId, isFree).subscribe({
    next: () => {
      // تحديث الحالة محليًا
      this.lessonFreeStatus[this.selectedLessonId!] = isFree;
     this.toast.success("done")
    },
    error: (err) => {
      console.error('Error updating lesson free status:', err);
     this.toast.error(err.message.detail,"failed")
      // ارجاع الحالة السابقة إذا فشل التحديث
      checkbox.checked = !isFree;
    }
  });
}

// دالة لعرض حالة الدرس عند التحميل
isLessonFree(lessonId: number): boolean {
  return this.lessonFreeStatus[lessonId] || false;
}


    
}
