import { Component, OnInit } from '@angular/core';
import { TermDTO } from '../../../InterFace/term-dto';
import { HttpClient } from '@angular/common/http';
import { TermService } from '../../../service/term-service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GradeService } from '../../../service/grade-service';
import { GradeDTO } from '../../../InterFace/grade-dto';
import { UnitService } from '../../../service/unit-service';
import { LessonService } from '../../../service/lesson-service';
import { UnitDTO } from '../../../InterFace/unit-dto';
import { LessonDTO } from '../../../InterFace/lesson-dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-get-all-terms-for-grade',
  imports: [CommonModule, FormsModule],
  templateUrl: './get-all-terms-for-grade.html',
  styleUrl: './get-all-terms-for-grade.css',
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ height: '0', opacity: '0', overflow: 'hidden' }),
        animate('300ms ease-out', style({ height: '*', opacity: '1' }))
      ]),
      transition(':leave', [
        style({ height: '*', opacity: '1', overflow: 'hidden' }),
        animate('300ms ease-in', style({ height: '0', opacity: '0' }))
      ])
    ])
  ]
})
export class GetAllTermsForGrade implements OnInit {
  terms: TermDTO[] = [];
  SelectedGrade: GradeDTO | null = null;
  SelectedGradeId: number = 0;
  selectedTermId: number = 0;
  selectedUnitId: number = 0;
  
  // Store units and lessons by their parent IDs
  unitsByTerm: Map<number, UnitDTO[]> = new Map();
  lessonsByUnit: Map<number, LessonDTO[]> = new Map();
  
  // Track expanded states
  expandedTerms: Set<number> = new Set();
  expandedUnits: Set<number> = new Set();

  constructor(
    private http: HttpClient,
    private termService: TermService,
    private router: Router,
    private gradeService: GradeService,
    private unitService: UnitService,
    private lessonService: LessonService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.SelectedGrade = this.gradeService.getGrade();
    this.SelectedGradeId = this.SelectedGrade ? this.SelectedGrade.id : 0;
    this.loadTerms();
  }

  loadTerms(): void {
    if (this.SelectedGradeId === 0) {
      console.warn('⚠️ No grade selected.');
      return;
    }

    this.termService.getTermsByGrade(this.SelectedGradeId).subscribe(
      (data: TermDTO[]) => {
        this.terms = data;
      },
      (error) => {
        console.error('❌ Error fetching terms:', error.message);
        this.toast.error(error.message.detail, 'Error');
      
      }
    );
  }

  // Toggle term expansion
  toggleTerm(termId: number): void {
    if (this.expandedTerms.has(termId)) {
      this.expandedTerms.delete(termId);
    } else {
      this.expandedTerms.add(termId);
      // Load units if not already loaded
      if (!this.unitsByTerm.has(termId)) {
        this.loadUnitsForTerm(termId);
      }
    }
  }

  // Toggle unit expansion
  toggleUnit(unitId: number): void {
    if (this.expandedUnits.has(unitId)) {
      this.expandedUnits.delete(unitId);
    } else {
      this.expandedUnits.add(unitId);
      // Load lessons if not already loaded
      if (!this.lessonsByUnit.has(unitId)) {
        this.loadLessonsForUnit(unitId);
      }
    }
  }

  // Load units for a specific term
  loadUnitsForTerm(termId: number): void {
    this.unitService.getUnitsByTerm(termId).subscribe({
      next: (units) => {
        this.unitsByTerm.set(termId, units);
      },
      error: (err) => {
        console.error('Error loading units:', err);
    
      }
    });
  }

  // Load lessons for a specific unit
  loadLessonsForUnit(unitId: number): void {
    this.lessonService.getLessonsByUnit(unitId).subscribe({
      next: (lessons) => {
        this.lessonsByUnit.set(unitId, lessons);
      },
      error: (err) => {
        console.error('Error loading lessons:', err);
        
      }
    });
  }

  // Check if term is expanded
  isTermExpanded(termId: number): boolean {
    return this.expandedTerms.has(termId);
  }

  // Check if unit is expanded
  isUnitExpanded(unitId: number): boolean {
    return this.expandedUnits.has(unitId);
  }

  // Get units for a specific term
  getUnitsForTerm(termId: number): UnitDTO[] {
    return this.unitsByTerm.get(termId) || [];
  }

  // Get lessons for a specific unit
  getLessonsForUnit(unitId: number): LessonDTO[] {
    return this.lessonsByUnit.get(unitId) || [];
  }
  GetSelectedOneLesson(lesson: LessonDTO) {
    this.lessonService.setLesson(lesson);
    this.router.navigate(['/AdmenBody/ShowLessonMedia']);
  }
}