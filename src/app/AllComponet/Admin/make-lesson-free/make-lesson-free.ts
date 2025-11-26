import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GradeService } from '../../../service/grade-service';
import { TermService } from '../../../service/term-service';
import { UnitService } from '../../../service/unit-service';
import { LessonService } from '../../../service/lesson-service';
import { SubjectService } from '../../../service/subject';
import { ToastrService } from 'ngx-toastr';
import { GradeDTO } from '../../../InterFace/grade-dto';
import { TermDTO } from '../../../InterFace/term-dto';
import { UnitDTO } from '../../../InterFace/unit-dto';
import { LessonDTO } from '../../../InterFace/lesson-dto';
import { SubjectDTO } from '../../../InterFace/subject';

@Component({
  selector: 'app-make-lesson-free',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ مهم
  templateUrl: './make-lesson-free.html',
  styleUrls: ['./make-lesson-free.css']
})
export class MakeLessonFree {
  subjects: SubjectDTO[] = [];
  grades: GradeDTO[] = [];
  terms: TermDTO[] = [];
  units: UnitDTO[] = [];
  lessons: LessonDTO[] = [];

  selectedSubjectId = 0;
  selectedGradeId = 0;
  selectedTermId = 0;
  selectedUnitId = 0;
  selectedLessonId: number | null = null;

  lessonFreeStatus: { [key: number]: boolean } = {};

  constructor(
    private gradeService: GradeService,
    private termService: TermService,
    private unitService: UnitService,
    private lessonService: LessonService,
    private subjectService: SubjectService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadSubjects();
  }

  loadSubjects(): void {
    this.subjectService.getAllSubjects().subscribe({
      next: data => this.subjects = data
    });
  }

  onSubjectChange(): void {
    this.selectedGradeId = 0;
    this.selectedTermId = 0;
    this.selectedUnitId = 0;
    this.selectedLessonId = null;
    this.grades = [];
    this.terms = [];
    this.units = [];
    this.lessons = [];

    this.gradeService.getGradeBySubjectId(this.selectedSubjectId).subscribe({
      next: res => this.grades = res
    });
  }

  onGradeChange(): void {
    this.selectedTermId = 0;
    this.selectedUnitId = 0;
    this.selectedLessonId = null;
    this.terms = [];
    this.units = [];
    this.lessons = [];

    this.termService.getTermsByGrade(this.selectedGradeId).subscribe({
      next: res => this.terms = res
    });
  }

  onTermChange(): void {
    this.selectedUnitId = 0;
    this.selectedLessonId = null;
    this.units = [];
    this.lessons = [];

    this.unitService.getUnitsByTerm(this.selectedTermId).subscribe({
      next: res => this.units = res
    });
  }

  onUnitChange(): void {
    this.selectedLessonId = null;
    this.lessons = [];
    if (this.selectedUnitId > 0) {
      this.lessonService.getLessonsByUnit(this.selectedUnitId).subscribe({
        next: res => this.lessons = res
      });
    }
  }

  onLessonChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedLessonId = Number(select.value);
    
  }


isLessonFree(lessonId: number): boolean {
    const lesson = this.lessons.find(l => l.id === lessonId);
    return lesson?.isFree ?? false;
  }

  toggleLessonFree(event: Event) {
  if (!this.selectedLessonId) return;

  const checkbox = event.target as HTMLInputElement;
  const lesson = this.lessons.find(l => l.id === this.selectedLessonId);
  if (!lesson) return;

  const newStatus = checkbox.checked;

  if (lesson.isFree === newStatus) {
    this.toast.info('Lesson is already ' + (newStatus ? 'Free' : 'Not Free'));
    checkbox.checked = lesson.isFree; // ارجع للحالة القديمة
    return;
  }

  this.lessonService.updateIsFree(this.selectedLessonId, newStatus).subscribe({
    next: () => {
      lesson.isFree = newStatus;
      this.toast.success('Lesson status updated');
    },
    error: (err) => {
      checkbox.checked = !newStatus;
        const msg =
        err?.error?.detail ||
        err?.error?.title ||
        err?.message ||
        'Failed to revoke access';

    this.toast.error(msg);
    
    }
  });
}

}
