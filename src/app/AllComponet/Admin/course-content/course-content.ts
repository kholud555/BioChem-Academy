import { Component, OnInit } from '@angular/core';
import { SubjectDTO } from '../../../InterFace/subject';
import { GradeDTO } from '../../../InterFace/grade-dto';
import { SubjectService } from '../../../service/subject';
import { GradeService } from '../../../service/grade-service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-course-content',
  imports: [CommonModule, FormsModule],
  templateUrl: './course-content.html',
  styleUrls: ['./course-content.css'],
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ height: '0', opacity: 0, overflow: 'hidden' }),
        animate('300ms ease-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ height: '*', opacity: 1, overflow: 'hidden' }),
        animate('300ms ease-in', style({ height: '0', opacity: 0 }))
      ])
    ])
  ]
})
export class CourseContent implements OnInit {
  subjects: SubjectDTO[] = [];
  gradesBySubject: Map<number, GradeDTO[]> = new Map();
  expandedSubjects: Set<number> = new Set();

  constructor(
    private subjectService: SubjectService,
    private gradeService: GradeService,
    private router: Router,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadSubjects();
  }

  loadSubjects(): void {
    this.subjectService.getAllSubjects().subscribe({
      next: data => this.subjects = data,
      error: err => console.error('Error loading subjects:', err)
    });
  }

  toggleSubject(subject: SubjectDTO): void {
    if (this.expandedSubjects.has(subject.id)) {
      this.expandedSubjects.delete(subject.id);
    } else {
      this.expandedSubjects.add(subject.id);

      // Load grades for subject if not loaded yet
      if (!this.gradesBySubject.has(subject.id)) {
        this.gradeService.getGradeBySubjectId(subject.id).subscribe({
          next: grades => {
            this.gradesBySubject.set(subject.id, grades);
            this.toast.success(`Grades for ${subject.subjectName} loaded`);
          },
          error: err => console.error('Error fetching grades:', err)
        });
      }
    }
  }

  isSubjectExpanded(subjectId: number): boolean {
    return this.expandedSubjects.has(subjectId);
  }

  onSelectGrade(grade: GradeDTO): void {
    this.gradeService.setGrade(grade);
    this.router.navigate(['/AdmenBody/get-all-terms-for-grade']);
  }

  getGradesForSubject(subjectId: number): GradeDTO[] {
    return this.gradesBySubject.get(subjectId) || [];
  }
}
