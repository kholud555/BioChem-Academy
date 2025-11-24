import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { AccessControlService } from '../../../service/access-controll-service';
import { GradeService } from '../../../service/grade-service';
import { TermService } from '../../../service/term-service';
import { UnitService } from '../../../service/unit-service';
import { LessonService } from '../../../service/lesson-service';
import { StudentService } from '../../../service/Student/student-service';
import { SubjectService } from '../../../service/subject';

import { AccessControlDTO } from '../../../InterFace/access-control-dto';
import { LessonDTO } from '../../../InterFace/lesson-dto';
import { GradeDTO } from '../../../InterFace/grade-dto';
import { TermDTO } from '../../../InterFace/term-dto';
import { UnitDTO } from '../../../InterFace/unit-dto';
import { StudentDto } from '../../../InterFace/student-dto';
import { SubjectDTO } from '../../../InterFace/subject';

interface ExtendedGradeDTO extends GradeDTO { isOpen?: boolean; }
interface ExtendedTermDTO extends TermDTO { isOpen?: boolean; }
interface ExtendedUnitDTO extends UnitDTO { isOpen?: boolean; }

@Component({
  selector: 'app-access-control',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbDropdownModule],
  templateUrl: './access-control.html',
  styleUrls: ['./access-control.css']
})
export class AccessControl implements OnInit {
  SelectedStudent: StudentDto | null = null;
  permissions: any = null;

  grades: ExtendedGradeDTO[] = [];
  terms: ExtendedTermDTO[] = [];
  units: ExtendedUnitDTO[] = [];
  lessons: LessonDTO[] = [];

  subjects: SubjectDTO[] = [];
  selectedSubjectId: number = 0;
  selectedGradeId: number = 0;
  selectedTermId: number = 0;
  selectedUnitId: number = 0;

  loading = false;

  constructor(
    private route: ActivatedRoute,
    private gradeService: GradeService,
    private termService: TermService,
    private unitService: UnitService,
    private lessonService: LessonService,
    private accessService: AccessControlService,
    private toastr: ToastrService,
    private studentService: StudentService,
    private subjectService: SubjectService
  ) {}

  ngOnInit(): void {
    this.loadSubjects();

    this.SelectedStudent = this.getFromSession<StudentDto>('selectedStudent');
    this.permissions = this.getFromSession<any>('permissions');
    this.grades = this.getFromSession<ExtendedGradeDTO[]>('grades') || [];
    this.terms = this.getFromSession<ExtendedTermDTO[]>('terms') || [];
    this.units = this.getFromSession<ExtendedUnitDTO[]>('units') || [];
    this.lessons = this.getFromSession<LessonDTO[]>('lessons') || [];

    if (!this.SelectedStudent) {
      this.SelectedStudent = this.studentService.getStudent();
      if (this.SelectedStudent) this.saveToSession('selectedStudent', this.SelectedStudent);
    }

    if (this.SelectedStudent && !this.permissions) this.loadStudentPermissions();
    if (this.grades.length === 0) this.loadGrades();
  }

  // SessionStorage helpers
  saveToSession(key: string, data: any): void { sessionStorage.setItem(key, JSON.stringify(data)); }
  getFromSession<T>(key: string): T | null {
    const value = sessionStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  }
  removeFromSession(key: string): void { sessionStorage.removeItem(key); }

  // Load subjects
  loadSubjects(): void {
    this.subjectService.getAllSubjects().subscribe({
      next: data => this.subjects = data,
      error: err => console.error('Error loading subjects:', err)
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

    if (this.selectedSubjectId > 0) {
      this.gradeService.getGradeBySubjectId(this.selectedSubjectId).subscribe({
        next: res => this.grades = res.map(g => ({ ...g, isOpen: false })),
        error: err => console.error('Error loading grades for subject:', err)
      });
    } else {
      this.loadGrades();
    }
  }

  loadGrades(): void {
    this.grades = [];
    this.terms = [];
    this.units = [];
    this.lessons = [];

    this.saveToSession('grades', []);
    this.saveToSession('terms', []);
    this.saveToSession('units', []);
    this.saveToSession('lessons', []);

    this.gradeService.GetAllGrade().subscribe({
      next: gradesRes => {
        this.grades = gradesRes.map(g => ({ ...g, isOpen: false }));
        this.saveToSession('grades', this.grades);

        for (const grade of this.grades) {
          this.termService.getTermsByGrade(grade.id).subscribe(termsRes => {
            for (const term of termsRes) {
              if (!this.terms.some(t => t.id === term.id)) this.terms.push({ ...term, isOpen: false });
            }
            this.saveToSession('terms', this.terms);

            for (const term of termsRes) {
              this.unitService.getUnitsByTerm(term.id).subscribe(unitsRes => {
                for (const unit of unitsRes) {
                  if (!this.units.some(u => u.id === unit.id)) this.units.push({ ...unit, isOpen: false });
                }
                this.saveToSession('units', this.units);

                for (const unit of unitsRes) {
                  this.lessonService.getLessonsByUnit(unit.id).subscribe(lessonsRes => {
                    for (const lesson of lessonsRes) {
                      if (!this.lessons.some(l => l.id === lesson.id)) this.lessons.push(lesson);
                    }
                    this.saveToSession('lessons', this.lessons);
                  });
                }
              });
            }
          });
        }
      },
      error: err => {
        console.error('Error loading grades:', err.message);
        this.toastr.error(err.error?.detail || 'Failed to load data', 'Error');
      }
    });
  }

  // Load student permissions
  loadStudentPermissions(): void {
    if (!this.SelectedStudent?.id) return;

    this.accessService.getStudentPermissions(this.SelectedStudent.id, true).subscribe({
      next: res => {
        this.permissions = {
          gradeIds: res.grantedGrade || [],
          termIds: res.grantedTerms || [],
          unitIds: res.grantedUnits || [],
          lessonIds: res.grantedLessons || []
        };
        this.saveToSession('permissions', this.permissions);
      },
      error: err => {
        console.error('Error loading permissions:', err.message);
        this.toastr.error(err.message.detail || '', 'Error');
      }
    });
  }

  // Filters
  getTermsForGrade(gradeId: number): ExtendedTermDTO[] {
    return this.terms.filter(t => t.gradeId === gradeId && 
      (this.selectedSubjectId === 0 || t.subjectId === this.selectedSubjectId));
  }

  getUnitsForTerm(termId: number): ExtendedUnitDTO[] {
    return this.units.filter(u => u.termId === termId && 
      (this.selectedSubjectId === 0 || u.subjectId === this.selectedSubjectId));
  }

  getLessonsForUnit(unitId: number): LessonDTO[] {
    return this.lessons.filter(l => l.unitId === unitId && 
      (this.selectedSubjectId === 0 || l.subjectId === this.selectedSubjectId));
  }

  // Grant / Revoke
  grantSingle(type: 'Grade' | 'Term' | 'Unit' | 'Lesson', sectionId: number) {
    if (!this.SelectedStudent?.id) { this.toastr.info('Please select a student first!'); return; }

    const dto: AccessControlDTO = {
      grantedType: this.getGrantedTypeValue(type),
      studentId: this.SelectedStudent.id,
      grantedSectionId: sectionId
    };

    this.loading = true;
    this.accessService.grantAccess(dto).subscribe({
      next: () => { this.loading = false; this.toastr.success(`Access granted for ${type}`); this.loadStudentPermissions(); },
      error: err => { this.loading = false; console.error(err); this.toastr.error(err.error?.detail || 'Failed to grant access', 'Error'); }
    });
  }
revokeSingle(type: 'Grade' | 'Term' | 'Unit' | 'Lesson', sectionId: number) {
  if (!this.SelectedStudent?.id) { 
    this.toastr.info('Please select a student first!'); 
    return; 
  }

  const dto: AccessControlDTO = {
    grantedType: this.getGrantedTypeValue(type),
    studentId: this.SelectedStudent.id,
    grantedSectionId: sectionId
  };

  this.loading = true;

  // 🟢 مهم جدًا – تنظيف session قبل التحميل
  this.removeFromSession('permissions');

  this.accessService.revokeAccess(dto).subscribe({
    next: () => {
      this.loading = false;
      this.toastr.info(`Access revoked for ${type}`);

      // 🟢 تحميل permissions جديدة
      this.loadStudentPermissions();
    },
    error: err => {
      this.loading = false;
      console.error('Revoke Error:', err);

      const msg =
        err?.error?.detail ||
        err?.error?.title ||
        err?.message ||
        'Failed to revoke access';

      this.toastr.error(msg, 'Error');
    }
  });
}


  getGrantedTypeValue(type: 'Grade' | 'Term' | 'Unit' | 'Lesson'): number {
    switch(type) { case 'Grade': return 0; case 'Term': return 1; case 'Unit': return 2; case 'Lesson': return 3; default: return 6; }
  }

  // Display granted items
  getGrantedGrades(): ExtendedGradeDTO[] { return this.permissions?.gradeIds?.length ? this.grades.filter(g => this.permissions.gradeIds.includes(g.id)) : []; }
  getGrantedTerms(): ExtendedTermDTO[] { return this.permissions?.termIds?.length ? this.terms.filter(t => this.permissions.termIds.includes(t.id)) : []; }
  getGrantedUnits(): ExtendedUnitDTO[] { return this.permissions?.unitIds?.length ? this.units.filter(u => this.permissions.unitIds.includes(u.id)) : []; }
  getGrantedLessons(): LessonDTO[] { return this.permissions?.lessonIds?.length ? this.lessons.filter(l => this.permissions.lessonIds.includes(l.id)) : []; }
}
