import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../service/Student/student-service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { GradeService } from '../../service/grade-service';
import { TermService } from '../../service/term-service';
import { UnitService } from '../../service/unit-service';
import { LessonService } from '../../service/lesson-service';
import { AccessControlService } from '../../service/access-controll-service';

import { TermDTO } from '../../InterFace/term-dto';
import { GradeDTO } from '../../InterFace/grade-dto';
import { UnitDTO } from '../../InterFace/unit-dto';
import { LessonDTO } from '../../InterFace/lesson-dto';
import { Profile } from '../../InterFace/register';
import { NavBar } from "../nav-bar/nav-bar";
import { Location } from '@angular/common';

@Component({
  selector: 'app-courses',
  imports: [CommonModule, NavBar],
  templateUrl: './courses.html',
  styleUrls: ['./courses.css']
})
export class Courses implements OnInit {

  studentId!: number;

  studentData: Profile = {
    userName: "",
    email: "",
    grade: "",
    phoneNumber: "",
    parentNumber: ""
  };

  terms: TermDTO[] = [];
  SelectLesson:any;
  unitsByTerm: Map<number, UnitDTO[]> = new Map();
  lessonsByUnit: Map<number, LessonDTO[]> = new Map();

  expandedTerms: Set<number> = new Set();
  expandedUnits: Set<number> = new Set();

  constructor(
   
    private router: Router,
    private studentService: StudentService,
    private gradeService: GradeService,
    private termService: TermService,
    private unitService: UnitService,
    private lessonService: LessonService,
    private accessService: AccessControlService,
     private location: Location,
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
     // جلب الدرس المختار
  this.SelectLesson = this.lessonService.getLesson();
   // جلب الدرس المختار
 
  }
  goBack() {
    this.location.back();
  }


  // 🚀 تحميل البروفايل ثم الجريد ثم التيرمز
  loadInitialData() {
    this.studentService.getStudentProfile().subscribe({
      next: (profile) => {
    
        this.studentData = profile;
        sessionStorage.setItem('studentProfile', JSON.stringify(profile));

        this.loadStudentId();

        if (this.studentData.grade) {
          this.loadStudentGrade();
        } else {
          console.error("❌ grade is EMPTY → terms will not load");
        }
      },

      error: (err) => console.error("Error loading profile:", err)
    });
  }

  // ✔ تحميل studentId من السيرفر أو sessionStorage
  loadStudentId() {
    const storedId = sessionStorage.getItem("studentId");

    if (storedId) {
      this.studentId = +storedId;
      return;
    }

    this.studentService.GetStudentdIdByUserId().subscribe({
      next: (id) => {
        this.studentId = id;
        sessionStorage.setItem("studentId", id.toString());
      },
      error: (err) => console.error(err)
    });
  }

  // ✔ تحميل الجريد بناءً على gradeName
  loadStudentGrade() {
   
    this.gradeService.getGradeByName(this.studentData.grade).subscribe({
      next: (grade) => {
        if (grade) {
        
          this.loadTerms(grade.id);
        } else {
          console.error("❌ Grade Not Found");
        }
      },

      error: (err) => console.error("Error loading grade:", err)
    });
  }

  // ✔ تحميل التيرمز
  loadTerms(gradeId: number) {
    this.termService.getTermsByGrade(gradeId).subscribe({
      next: (terms) => {
       
        this.terms = terms;
        sessionStorage.setItem('terms', JSON.stringify(terms));
      },

      error: (err) => console.error("Error loading terms:", err)
    });
  }

  // ✔ فتح التيرم وتحميل وحداته
  toggleTerm(termId: number) {
    if (this.expandedTerms.has(termId)) {
      this.expandedTerms.delete(termId);
    } else {
      this.expandedTerms.add(termId);

      if (!this.unitsByTerm.has(termId)) {
        this.loadUnitsForTerm(termId);
      }
    }
  }

  // ✔ تحميل الوحدات للتيرم
  loadUnitsForTerm(termId: number) {
    this.unitService.getUnitsByTerm(termId).subscribe({
      next: (units) => {
       
        this.unitsByTerm.set(termId, units);

        const obj = Object.fromEntries(this.unitsByTerm);
        sessionStorage.setItem('unitsByTerm', JSON.stringify(obj));
      },

      error: (err) => console.error("Error loading units:", err)
    });
  }

  // ✔ فتح الوحدة وتحميل الدروس
  toggleUnit(unitId: number) {
    if (this.expandedUnits.has(unitId)) {
      this.expandedUnits.delete(unitId);
    } else {
      this.expandedUnits.add(unitId);

      if (!this.lessonsByUnit.has(unitId)) {
        this.loadLessonsForUnit(unitId);
      }
    }
  }

  // ✔ تحميل الدروس
  loadLessonsForUnit(unitId: number) {
    this.lessonService.getLessonsByUnit(unitId).subscribe({
      next: (lessons) => {
       
        this.lessonsByUnit.set(unitId, lessons);

        const obj = Object.fromEntries(this.lessonsByUnit);
        sessionStorage.setItem('lessonsByUnit', JSON.stringify(obj));
      },

      error: (err) => console.error("Error loading lessons:", err)
    });
  }

  // ✔ getter لعرض الوحدات
  getUnitsForTerm(termId: number): UnitDTO[] {
    return this.unitsByTerm.get(termId) || [];
  }

  // ✔ getter لعرض الدروس
  getLessonsForUnit(unitId: number): LessonDTO[] {
    return this.lessonsByUnit.get(unitId) || [];
  }

  // ✔ فتح الدرس
  goToLesson(lesson: LessonDTO) {
    this.lessonService.setLesson(lesson);

    this.router.navigate(['/CourseLessonMedia']);
  }
}
