import { Component, OnInit } from '@angular/core';
import { AccessControlDTO } from '../../../InterFace/access-control-dto';
import {  AccessControlService } from '../../../service/access-controll-service';
import { GradeService } from '../../../service/grade-service';
import { TermService } from '../../../service/term-service';
import { UnitService } from '../../../service/unit-service';
import { LessonService } from '../../../service/lesson-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-access-control',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './access-control.html',
  styleUrls: ['./access-control.css']
})
export class AccessControl implements OnInit {
  grades: any[] = [];
  terms: any[] = [];
  units: any[] = [];
  lessons: any[] = [];

  selectedGradeId = 0;
  selectedTermId = 0;
  selectedUnitId = 0;
  

   studentID = 0;
  studentName = '';
  studentGrade = '';
  constructor(
    private gradeService: GradeService,
    private termService: TermService,
    private unitService: UnitService,
    private lessonService: LessonService,
    private accessService:  AccessControlService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadGrades();
    this.route.queryParamMap.subscribe(params => {
      this.studentID  = Number(params.get('id'));
      this.studentName = params.get('name') ?? '';
      this.studentGrade = params.get('grade') ?? '';
    });

    console.log('✅ Student info:', this.studentID , this.studentName, this.studentGrade);
  }
  

  // 🟢 تحميل الصفوف
  loadGrades(): void {
    this.gradeService.GetAllGrade().subscribe({
      next: (res) => (this.grades = res),
      error: (err) => console.error('Error loading grades:', err)
    });
  }

  // 🔹 عند اختيار Grade
  onGradeChange(): void {
    this.termService.getTermsByGrade(this.selectedGradeId).subscribe({
      next: (res) => {
        this.terms = res;
        this.units = [];
        this.lessons = [];
      }
    });
  }

  // 🔹 عند اختيار Term
  onTermChange(): void {
    this.unitService.getUnitsByTerm(this.selectedTermId).subscribe({
      next: (res) => {
        this.units = res;
        this.lessons = [];
      }
    });
  }

  // 🔹 عند اختيار Unit
  onUnitChange(): void {
    if (this.selectedUnitId > 0) {
      this.lessonService.getLessonsByUnit(this.selectedUnitId).subscribe({
        next: (res) => {
          // 🟩 نضيف خاصية isGranted علشان نقدر نستخدمها في الـ checkbox
          this.lessons = res.map((l: any) => ({ ...l, isGranted: false }));
        },
        error: (err) => console.error('Error loading lessons:', err)
      });
    }
  }

  // ✅ منح صلاحيات
  grantAccess(): void {
    const selectedLessons = this.lessons.filter((l) => l.isGranted);
    if (selectedLessons.length === 0) {
      alert('⚠️ Please select at least one lesson.');
      return;
    }

    selectedLessons.forEach((lesson) => {
      const dto: AccessControlDTO = {
        studentId: this.studentID,
        grantedSectionId: lesson.id,
        grantedType: 1
      };

      this.accessService.grantAccess(dto).subscribe({
        next: () => console.log(`✅ Granted lesson ${lesson.title}`),
        error: (err) => console.error('❌ Grant failed:', err)
      });
    });

    alert('✅ Access granted successfully.');
  }

  // ❌ سحب الصلاحيات
  revokeAccess(): void {
    const selectedLessons = this.lessons.filter((l) => l.isGranted);
    if (selectedLessons.length === 0) {
      alert('⚠️ Please select at least one lesson.');
      return;
    }

    selectedLessons.forEach((lesson) => {
      const dto: AccessControlDTO = {
        studentId: this.studentID,
        grantedSectionId: lesson.id,
        grantedType: 1
      };

      this.accessService.revokeAccess(dto).subscribe({
        next: () => console.log(`🗑️ Revoked lesson ${lesson.title}`),
        error: (err) => console.error('❌ Revoke failed:', err)
      });
    });

    alert('🗑️ Access revoked successfully.');
  }
}
