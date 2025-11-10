import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AccessControlService } from '../../../service/access-controll-service';
import { GradeService } from '../../../service/grade-service';
import { TermService } from '../../../service/term-service';
import { UnitService } from '../../../service/unit-service';
import { LessonService } from '../../../service/lesson-service';
import { AccessControlDTO } from '../../../InterFace/access-control-dto';
import { LessonDTO } from '../../../InterFace/lesson-dto';
import { ToastrService } from 'ngx-toastr';
import { StudentDto } from '../../../InterFace/student-dto';
import { StudentService } from '../../../service/Student/student-service';
import { GradeDTO } from '../../../InterFace/grade-dto';
import { TermDTO } from '../../../InterFace/term-dto';
import { UnitDTO } from '../../../InterFace/unit-dto';

@Component({
  selector: 'app-access-control',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbDropdownModule],
  templateUrl: './access-control.html',
  styleUrls: ['./access-control.css']
})
export class AccessControl implements OnInit {
  // SelectedStudentName = '';
  // SelectedStudentId = 0;
  // SelectedStudentGrade = '';
  SelectedStudent: StudentDto | null = null;

  permissions: any = null;

   hoveredItem = {
    type: null as string | null,
    id: null as number | null
  };

  activeSectionId: number | null = null;
  activeSectionType: 'Grade' | 'Term' | 'Unit' | 'Lesson' | null = null;

  grades:GradeDTO[] = [];
  terms: TermDTO[] = [];
  units: UnitDTO[] = [];
  lessons: LessonDTO[] = [];

  selectedGradeIds: number[] = [];
  selectedTermIds: number[] = [];
  selectedUnitIds: number[] = [];
  selectedLessonIds: number[] = [];

  message = '';
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private gradeService: GradeService,
    private termService: TermService,
    private unitService: UnitService,
    private lessonService: LessonService,
    private accessService: AccessControlService,
    private taost: ToastrService,
    private studentService: StudentService
  ) {}


  ngOnInit(): void {
    this.loadGrades();
    this.SelectedStudent = this.studentService.getStudent();
    if (this.SelectedStudent) {
      this.loadStudentPermissions();
    }
  }

  getTermNames(terms: any[]): string {
    if (!terms || terms.length === 0) return 'None';
    return terms.map(t => (t === 0 ? 'First Term' : 'Second Term')).join(', ');
  }

  loadStudentPermissions(): void {
    this.accessService.getStudentPermissions(this.SelectedStudent?.id || 0, true).subscribe({
      next: res => {
        this.permissions = res;
        console.log('Student Permissions:', res);
      },
      error: err => console.error('Error loading permissions:', err)
    });
  }

  loadGrades(): void {
    this.gradeService.GetAllGrade().subscribe({
      next: res => (this.grades = res),
      error: err => console.error('Error loading grades:', err)
    });
  }

  onTermToggle(event: Event, termId: number): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedTermIds.push(termId);
      this.unitService.getUnitsByTerm(termId).subscribe(res => {
        this.units = [...this.units, ...res];
      });
    } else {
      this.selectedTermIds = this.selectedTermIds.filter(id => id !== termId);
      this.units = this.units.filter(u => u.termId !== termId);
    }
  }

  onUnitToggle(event: Event, unitId: number): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedUnitIds.push(unitId);
      this.lessonService.getLessonsByUnit(unitId).subscribe(res => {
        this.lessons = [...this.lessons, ...res];
      });
    } else {
      this.selectedUnitIds = this.selectedUnitIds.filter(id => id !== unitId);
      this.lessons = this.lessons.filter(l => l.unitId !== unitId);
    }
  }

  onLessonToggle(event: Event, lessonId: number): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) this.selectedLessonIds.push(lessonId);
    else this.selectedLessonIds = this.selectedLessonIds.filter(id => id !== lessonId);
  }

  setActiveSection(type: 'Grade' | 'Term' | 'Unit' | 'Lesson', id: number) {
    this.activeSectionId = id;
    this.activeSectionType = type;
    this.loadStudentPermissions();
  }

  grantSingle(type: 'Grade' | 'Term' | 'Unit' | 'Lesson', sectionId: number) {
    if (!this.SelectedStudent?.id) {
      this.taost.info('Select a student first!');
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
        this.message = `✅ Granted access to ${type}`;
        this.taost.success(this.message);
        this.loadStudentPermissions();
      },
      error: err => {
        this.loading = false;
        console.error(err);
        this.taost.error('Grant failed, check console for details.');
      }
    });
  }

  revokeSingle(type: 'Grade' | 'Term' | 'Unit' | 'Lesson', sectionId: number) {
    if (!this.SelectedStudent?.id) {
      this.taost.info('Select a student first!');
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
        this.message = `Revoked access from ${type}`;
        this.taost.info(this.message);
        this.loadStudentPermissions();
      },
      error: err => {
        this.loading = false;
        console.error(err);
        this.taost.error('Revoke failed, check console for details.');
      }
    });
  }

  getGrantedTypeValue(type: 'Grade' | 'Term' | 'Unit' | 'Lesson'): number {
    switch (type) {
      case 'Grade': return 0;
      case 'Term': return 1;
      case 'Unit': return 2;
      case 'Lesson': return 3;
      default: return 6;
    }
  }

    onGradeToggle(event: Event, gradeId: number): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedGradeIds.push(gradeId);
      this.termService.getTermsByGrade(gradeId).subscribe(res => {
        this.terms = [...this.terms, ...res];
      });
    } else {
      this.selectedGradeIds = this.selectedGradeIds.filter(id => id !== gradeId);
      this.terms = this.terms.filter(t => t.gradeId !== gradeId);
    }
  }
  grantAllLessons() {
    this.lessons.forEach(lesson => {
      this.grantSingle('Lesson', lesson.id);
    });
  }

  revokeAllLessons() {
    this.lessons.forEach(lesson => {
      this.revokeSingle('Lesson', lesson.id);
    });
  }

  // Dropdowns
  onGradeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const gradeId = parseInt(selectElement.value);

    if (gradeId) {
      this.grantSingle('Grade', gradeId);
      selectElement.value = '';

      this.termService.getTermsByGrade(gradeId).subscribe(res => {
        this.terms = [...this.terms, ...res.filter(t => !this.terms.some(existing => existing.id === t.id))];
      });
    }
  }

  onTermChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const termId = parseInt(selectElement.value);

    if (termId) {
      this.grantSingle('Term', termId);
      selectElement.value = '';

      this.unitService.getUnitsByTerm(termId).subscribe(res => {
        this.units = [...this.units, ...res.filter(u => !this.units.some(existing => existing.id === u.id))];
      });
    }
  }

  onUnitChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const unitId = parseInt(selectElement.value);

    if (unitId) {
      this.grantSingle('Unit', unitId);
      selectElement.value = '';

      this.lessonService.getLessonsByUnit(unitId).subscribe(res => {
        this.lessons = [...this.lessons, ...res.filter(l => !this.lessons.some(existing => existing.id === l.id))];
      });
    }
  }

  onLessonChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const lessonId = parseInt(selectElement.value);

    if (lessonId) {
      this.grantSingle('Lesson', lessonId);
      selectElement.value = '';
    }
  }

  setHoveredItem(type: string, id: number): void {
    this.hoveredItem = { type, id };
  }
  getTermsForGrade(gradeId: number): TermDTO[] {
  return this.terms.filter(t => t.gradeId === gradeId);
}

getUnitsForTerm(termId: number): UnitDTO[] {
  return this.units.filter(u => u.termId === termId);
}

getLessonsForUnit(unitId: number): LessonDTO[] {
  return this.lessons.filter(l => l.unitId === unitId);
}


  clearHoveredItem(): void {
    this.hoveredItem = { type: null, id: null };
  }

  getGrantedGrades(): any[] {
    if (!this.permissions?.gradeIds) return [];
    return this.grades.filter(g => this.permissions.gradeIds.includes(g.id));
  }

  getGrantedTerms(): any[] {
    if (!this.permissions?.termIds) return [];
    return this.terms.filter(t => this.permissions.termIds.includes(t.id));
  }

  getGrantedUnits(): any[] {
    if (!this.permissions?.unitIds) return [];
    return this.units.filter(u => this.permissions.unitIds.includes(u.id));
  }

  getGrantedLessons(): any[] {
    if (!this.permissions?.lessonIds) return [];
    return this.lessons.filter(l => this.permissions.lessonIds.includes(l.id));
  }
  
  isOpen = {
    grade: true,
    term: true,
    unit: true,
    lesson1: true,
    lesson2: true
  };

  // toggle(section: string) {
  //   this.isOpen[section] = !this.isOpen[section];
  // }

}
