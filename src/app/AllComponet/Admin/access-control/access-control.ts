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

@Component({
  selector: 'app-access-control',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbDropdownModule],
  templateUrl: './access-control.html',
  styleUrls: ['./access-control.css']
})
export class AccessControl implements OnInit {
  SelectedStudentName = '';
  SelectedStudentId = 0;
  SelectedStudentGrade = '';

  permissions: any = null;

  activeSectionId: number | null = null;
  activeSectionType: 'Grade' | 'Term' | 'Unit' | 'Lesson' | null = null;

  grades: any[] = [];
  terms: any[] = [];
  units: any[] = [];
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
    private taost: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadGrades();

    this.route.queryParams.subscribe(params => {
      this.SelectedStudentId = +params['id'];
      this.SelectedStudentName = params['name'];
      this.SelectedStudentGrade = params['grade'];
    });

     if (this.SelectedStudentId) {
      this.loadStudentPermissions(); // 🟢 تحميل صلاحيات الطالب
    }
  
  }
getTermNames(terms: any[]): string {
  if (!terms || terms.length === 0) return 'None';
  return terms
    .map(t => t === 0 ? 'first term' : 'second term')
    .join(', ');
}

// 🟢 تحميل صلاحيات الطالب
loadStudentPermissions(): void {
  this.accessService.getStudentPermissions(this.SelectedStudentId, true).subscribe({
    next: (res) => {
      this.permissions = res;
      console.log('Student Permissions:', res);
    },
    error: (err) => console.error('Error loading permissions:', err)
  });
}
  // 🟢 تحميل الصفوف
  loadGrades(): void {
    this.gradeService.GetAllGrade().subscribe({
      next: res => (this.grades = res),
      error: err => console.error('Error loading grades:', err)
    });
  }

  // 🟢 عند اختيار صف
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

  // 🟢 عند اختيار ترم
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

  // 🟢 عند اختيار وحدة
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

  // 🟢 عند اختيار درس
  onLessonToggle(event: Event, lessonId: number): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) this.selectedLessonIds.push(lessonId);
    else this.selectedLessonIds = this.selectedLessonIds.filter(id => id !== lessonId);
  }

  // ✅ تحديد القسم النشط لعرض الأزرار
  setActiveSection(type: 'Grade' | 'Term' | 'Unit' | 'Lesson', id: number) {
    this.activeSectionId = id;
    this.activeSectionType = type;
    this.loadStudentPermissions();

  }

  // ✅ منح صلاحية
  grantSingle(type: 'Grade' | 'Term' | 'Unit' | 'Lesson', sectionId: number) {
    if (!this.SelectedStudentId) {
      this.taost.info(' Select a student first!');

      return;
    }

    const dto: AccessControlDTO = {
      grantedType: this.getGrantedTypeValue(type),
      studentId: this.SelectedStudentId,
      grantedSectionId: sectionId
    };

    this.loading = true;
    this.accessService.grantAccess(dto).subscribe({
      next: () => {
        this.loading = false;
        this.message = `✅ Granted access to ${type} ID: ${sectionId}`;
        this.taost.success(this.message);
        this.loadStudentPermissions();

      },
      error: err => {
        this.loading = false;
        console.error(err);
        this.taost.error(' Grant failed, check console for details.');
      }
    });
  }

  // ✅ سحب صلاحية
  revokeSingle(type: 'Grade' | 'Term' | 'Unit' | 'Lesson', sectionId: number) {
    if (!this.SelectedStudentId) {
     this.taost.info(' Select a student first!');
     this.loadStudentPermissions();

      return;
    }

    const dto: AccessControlDTO = {
      grantedType: this.getGrantedTypeValue(type),
      studentId: this.SelectedStudentId,
      grantedSectionId: sectionId
    };

    this.loading = true;
    this.accessService.revokeAccess(dto).subscribe({
      next: () => {
        this.loading = false;
        this.message = ` Revoked access from ${type}`;
        this.taost.info(this.message);
        this.loadStudentPermissions();

      },
      error: err => {
        this.loading = false;
        console.error(err);
      this.taost.error(' Revoke failed, check console for details.');
      }
    });
  }

  // 🧩 تحويل نوع العنصر لقيمة رقمية زي enum في C#
  getGrantedTypeValue(type: 'Grade' | 'Term' | 'Unit' | 'Lesson'): number {
    switch (type) {
      case 'Grade': return 0;
      case 'Term': return 1;
      case 'Unit': return 2;
      case 'Lesson': return 3;
      default: return 6;
    }
  }
  grantAllLessons() {
  this.lessons.forEach(lesson => {
    this.grantSingle('Lesson', lesson.id);
    this.loadStudentPermissions();

  });
}

revokeAllLessons() {
  this.lessons.forEach(lesson => {
    this.revokeSingle('Lesson', lesson.id);
    this.loadStudentPermissions();

  });
}

}
