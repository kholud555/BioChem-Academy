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

import { AccessControlDTO } from '../../../InterFace/access-control-dto';
import { LessonDTO } from '../../../InterFace/lesson-dto';
import { GradeDTO } from '../../../InterFace/grade-dto';
import { TermDTO } from '../../../InterFace/term-dto';
import { UnitDTO } from '../../../InterFace/unit-dto';
import { StudentDto } from '../../../InterFace/student-dto';

interface ExtendedGradeDTO extends GradeDTO {
  isOpen?: boolean;
}

interface ExtendedTermDTO extends TermDTO {
  isOpen?: boolean;
}

interface ExtendedUnitDTO extends UnitDTO {
  isOpen?: boolean;
}

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

  loading = false;

  constructor(
    private route: ActivatedRoute,
    private gradeService: GradeService,
    private termService: TermService,
    private unitService: UnitService,
    private lessonService: LessonService,
    private accessService: AccessControlService,
    private toastr: ToastrService,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    // ✅ استرجاع البيانات من sessionStorage
    this.SelectedStudent = this.getFromSession<StudentDto>('selectedStudent');
    this.permissions = this.getFromSession<any>('permissions');
    this.grades = this.getFromSession<ExtendedGradeDTO[]>('grades') || [];
    this.terms = this.getFromSession<ExtendedTermDTO[]>('terms') || [];
    this.units = this.getFromSession<ExtendedUnitDTO[]>('units') || [];
    this.lessons = this.getFromSession<LessonDTO[]>('lessons') || [];

    // ✅ لو الطالب مش متخزن نحاول نجيبه من السيرفيس
    if (!this.SelectedStudent) {
      this.SelectedStudent = this.studentService.getStudent();
      if (this.SelectedStudent) {
        this.saveToSession('selectedStudent', this.SelectedStudent);
      }
    }

    if (this.SelectedStudent) {
      if (!this.permissions) {
        this.loadStudentPermissions();
      }
    }

    if (this.grades.length === 0) {
      this.loadGrades();
    }
  }

  // ✅ دوال تخزين واسترجاع البيانات من sessionStorage
  saveToSession(key: string, data: any): void {
    sessionStorage.setItem(key, JSON.stringify(data));
  }

  getFromSession<T>(key: string): T | null {
    const value = sessionStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  }

  removeFromSession(key: string): void {
    sessionStorage.removeItem(key);
  }

  // ✅ تحميل صلاحيات الطالب
  loadStudentPermissions(): void {
    if (!this.SelectedStudent?.id) return;

    this.accessService.getStudentPermissions(this.SelectedStudent.id, true).subscribe({
      next: res => {
       

        this.permissions = {
          gradeIds: res.grantedGrade || [],
          termIds: res.grantedTerms || [],
          unitIds: res.grantedUnits || [],
          lessonIds: res.grantedLessons || [],
        };

        this.saveToSession('permissions', this.permissions);
        
      },
      error: err => {
        console.error('Error loading permissions:', err.message);
        this.toastr.error(err.message.detail || '', 'Error');
      }
    });
  }

loadGrades(): void {

  // 🔥 مهم جداً — فضي كل حاجة قبل التحميل عشان ميحصلش تراكم من session
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

      // 🔥 استخدم for … of بدل nested subscribe
      for (const grade of this.grades) {

        this.termService.getTermsByGrade(grade.id).subscribe(termsRes => {

          // 🛑 منع تكرار الترمات تماماً
          for (const term of termsRes) {
            if (!this.terms.some(t => t.id === term.id)) {
              this.terms.push({ ...term, isOpen: false });
            }
          }

          this.saveToSession('terms', this.terms);

          for (const term of termsRes) {

            this.unitService.getUnitsByTerm(term.id).subscribe(unitsRes => {

              for (const unit of unitsRes) {
                if (!this.units.some(u => u.id === unit.id)) {
                  this.units.push({ ...unit, isOpen: false });
                }
              }

              this.saveToSession('units', this.units);

              for (const unit of unitsRes) {

                this.lessonService.getLessonsByUnit(unit.id).subscribe(lessonsRes => {

                  for (const lesson of lessonsRes) {
                    if (!this.lessons.some(l => l.id === lesson.id)) {
                      this.lessons.push(lesson);
                    }
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



  // ✅ فلاتر
  getTermsForGrade(gradeId: number): ExtendedTermDTO[] {
    return this.terms.filter(t => t.gradeId === gradeId);
  }

  getUnitsForTerm(termId: number): ExtendedUnitDTO[] {
    return this.units.filter(u => u.termId === termId);
  }

  getLessonsForUnit(unitId: number): LessonDTO[] {
    return this.lessons.filter(l => l.unitId === unitId);
  }

  // ✅ منح صلاحية
  grantSingle(type: 'Grade' | 'Term' | 'Unit' | 'Lesson', sectionId: number) {
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
    this.accessService.grantAccess(dto).subscribe({
      next: () => {
        this.loading = false;
        this.toastr.success(`Access granted for ${type}`);
        this.loadStudentPermissions();
      },
      error: err => {
        this.loading = false;
        console.error(err);
        this.toastr.error(err.error?.detail || 'Failed to revoke access', 'Error');
      }
    });
  }

  // ✅ سحب صلاحية
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
    this.accessService.revokeAccess(dto).subscribe({
      next: () => {
        this.loading = false;
        this.toastr.info(`Access revoked for ${type}`);
        this.loadStudentPermissions();
        
      },
      error: err => {
        this.loading = false;
        console.error(err);
       
      }
    });
  }

  // ✅ تحويل النوع لقيمة رقمية
  getGrantedTypeValue(type: 'Grade' | 'Term' | 'Unit' | 'Lesson'): number {
    switch (type) {
      case 'Grade': return 0;
      case 'Term': return 1;
      case 'Unit': return 2;
      case 'Lesson': return 3;
      default: return 6;
    }
  }

  // ✅ عرض البيانات الممنوحة في الواجهة
  getGrantedGrades(): ExtendedGradeDTO[] {
    if (!this.permissions?.gradeIds) return [];
    return this.grades.filter(g => this.permissions.gradeIds.includes(g.id));
  }

  getGrantedTerms(): ExtendedTermDTO[] {
    if (!this.permissions?.termIds) return [];
    return this.terms.filter(t => this.permissions.termIds.includes(t.id));
  }

  getGrantedUnits(): ExtendedUnitDTO[] {
    if (!this.permissions?.unitIds) return [];
    return this.units.filter(u => this.permissions.unitIds.includes(u.id));
  }

  getGrantedLessons(): LessonDTO[] {
    if (!this.permissions?.lessonIds) return [];
    return this.lessons.filter(l => this.permissions.lessonIds.includes(l.id));
  }
}
