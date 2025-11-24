import { Component, OnInit } from '@angular/core';
import { CreateLessonDTO, LessonDTO } from '../../../InterFace/lesson-dto';
import { GradeService } from '../../../service/grade-service';
import { UnitService } from '../../../service/unit-service';
import { LessonService } from '../../../service/lesson-service';
import { TermService } from '../../../service/term-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { GradeDTO } from '../../../InterFace/grade-dto';
import { TermDTO } from '../../../InterFace/term-dto';
import { UnitDTO } from '../../../InterFace/unit-dto';
import { SubjectDTO } from '../../../InterFace/subject';
import { SubjectService } from '../../../service/subject';

@Component({
  selector: 'app-lesson',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lesson.html',
  styleUrls: ['./lesson.css']
})
export class Lesson implements OnInit {

  subjects: SubjectDTO[] = [];
  grades: GradeDTO[] = [];
  terms: TermDTO[] = [];
  units: UnitDTO[] = [];
  lessons: LessonDTO[] = [];

  // selected filters
  selectedSubjectId = 0;
  selectedGradeId = 0;
  selectedTermId = 0;
  selectedUnitId = 0;

  selectedLessonId: number | null = null; 

  newLesson: CreateLessonDTO = {
    title: '',
    description: '',
    order: 1,
    subjectId: 0,
    unitId: 0
  };

  constructor(
    private gradeService: GradeService,
    private termService: TermService,
    private unitService: UnitService,
    private lessonService: LessonService,
    private subjectService: SubjectService
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
    this.grades = [];
    this.terms = [];
    this.units = [];
    this.lessons = [];

    this.selectedGradeId = 0;
    this.selectedTermId = 0;
    this.selectedUnitId = 0;

    this.gradeService.getGradeBySubjectId(this.selectedSubjectId).subscribe({
      next: res => this.grades = res
    });
  }

  onGradeChange(): void {
    this.terms = [];
    this.units = [];
    this.lessons = [];
    this.selectedTermId = 0;
    this.selectedUnitId = 0;

    this.termService.getTermsByGrade(this.selectedGradeId).subscribe({
      next: res => this.terms = res
    });
  }

  onTermChange(): void {
    this.units = [];
    this.lessons = [];
    this.selectedUnitId = 0;

    this.unitService.getUnitsByTerm(this.selectedTermId).subscribe({
      next: res => this.units = res
    });
  }

  onUnitChange(): void {
    if (this.selectedUnitId > 0) {
      this.lessonService.getLessonsByUnit(this.selectedUnitId).subscribe({
        next: res => this.lessons = res
      });
    }
  }

  addLesson(): void {
    if (this.selectedUnitId === 0) {
      Swal.fire('Error', 'Select a unit first', 'error');
      return;
    }

    this.newLesson.unitId = this.selectedUnitId;
    this.newLesson.subjectId = this.selectedSubjectId;

    this.lessonService.addLesson(this.newLesson).subscribe({
      next: (res) => {
        Swal.fire('Success', 'Lesson added successfully', 'success');
        this.newLesson = {
          title: '',
          description: '',
          order: 1,
          unitId: this.selectedUnitId,
          subjectId: this.selectedSubjectId
        };
        this.onUnitChange();
      },
      error: () => Swal.fire('Error', 'Failed to add lesson', 'error')
    });
  }

  deleteLesson(id: number): void {
  Swal.fire({
    icon: 'warning',
    title: 'Confirm delete?',
    showCancelButton: true
  }).then(r => {
    if (!r.isConfirmed) return;

    this.lessonService.deleteLesson(id).subscribe({
      next: () => {
        Swal.fire('Deleted', 'Lesson deleted', 'success');
        // تحديث قائمة الدروس مباشرة بعد الحذف
        this.lessons = this.lessons.filter(l => l.id !== id);
      },
      error: () => Swal.fire('Error', 'Delete failed', 'error')
    });
  });
}


  enableEdit(id: number): void {
    this.selectedLessonId = id;
  }

  saveEdit(lesson: LessonDTO): void {
    this.lessonService.updateLesson(lesson).subscribe({
      next: () => {
        Swal.fire('Updated', 'Lesson updated', 'success');
        this.selectedLessonId = null;
        this.onUnitChange();
      },
      error: () => Swal.fire('Error', 'Update failed', 'error')
    });
  }

  cancelEdit(): void {
    this.selectedLessonId = null;
    this.onUnitChange();
  }
}
